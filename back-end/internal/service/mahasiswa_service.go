package service

import (
	"context"
	"fmt"
	"log"
	"sort"
	"strings"
	"sync"
	"time"

	"github.com/unismuh/sipema/internal/cache"
	"github.com/unismuh/sipema/internal/domain"
	"github.com/unismuh/sipema/internal/dto"
	"github.com/unismuh/sipema/internal/repository"
)

// MahasiswaService handles business logic for students
type MahasiswaService struct {
	repo        repository.MahasiswaRepository
	redisCache  *cache.RedisCache
	memoryCache *memCache
	fetchMu     sync.Mutex    // prevents multiple concurrent API fetches
	fetching    bool          // true when a fetch is in progress
	fetchDone   chan struct{} // signals waiting goroutines that fetch completed
}

// memCache stores all data + computed results in memory as fallback
type memCache struct {
	mu        sync.RWMutex
	data      []domain.Mahasiswa
	stats     *dto.StatsResponse
	timestamp time.Time
	ttl       time.Duration
}

func (mc *memCache) isValid() bool {
	mc.mu.RLock()
	defer mc.mu.RUnlock()
	return mc.data != nil && time.Since(mc.timestamp) < mc.ttl
}

func (mc *memCache) getData() []domain.Mahasiswa {
	mc.mu.RLock()
	defer mc.mu.RUnlock()
	return mc.data
}

func (mc *memCache) getStats() *dto.StatsResponse {
	mc.mu.RLock()
	defer mc.mu.RUnlock()
	return mc.stats
}

func (mc *memCache) store(data []domain.Mahasiswa, stats *dto.StatsResponse) {
	mc.mu.Lock()
	defer mc.mu.Unlock()
	mc.data = data
	mc.stats = stats
	mc.timestamp = time.Now()
}

// NewMahasiswaService creates a new MahasiswaService
func NewMahasiswaService(repo repository.MahasiswaRepository) *MahasiswaService {
	return &MahasiswaService{
		repo: repo,
		memoryCache: &memCache{
			ttl: 10 * time.Minute,
		},
	}
}

// WithRedisCache adds Redis cache to the service
func (s *MahasiswaService) WithRedisCache(redisAddr, redisPassword string, redisDB, ttlMinutes int) *MahasiswaService {
	s.redisCache = cache.NewRedisCache(redisAddr, redisPassword, redisDB, ttlMinutes)
	if ttlMinutes > 0 {
		s.memoryCache.ttl = time.Duration(ttlMinutes) * time.Minute
	}
	return s
}

// PreloadCache warms the cache on startup (call in a goroutine)
func (s *MahasiswaService) PreloadCache(kodeFakultas string, angkatanFrom, angkatanTo int) {
	log.Println("[Preload] Starting cache warm-up...")
	start := time.Now()

	data, err := s.fetchWithCache(kodeFakultas, angkatanFrom, angkatanTo)
	if err != nil {
		log.Printf("[Preload] Failed to preload cache: %v", err)
		return
	}

	log.Printf("[Preload] Cache warm-up complete: %d records in %v", len(data), time.Since(start))

	// Also precompute and cache filtered lists
	ctx := context.Background()

	var aktif, tidakAktif, alumni, berprestasi, beasiswa []domain.Mahasiswa
	for _, m := range data {
		switch m.GetStatus() {
		case domain.StatusAktif:
			aktif = append(aktif, m)
		case domain.StatusTidakAktif:
			tidakAktif = append(tidakAktif, m)
		case domain.StatusAlumni:
			alumni = append(alumni, m)
		}
		if m.IsBerprestasi() {
			berprestasi = append(berprestasi, m)
		}
		if m.IsEligibleBeasiswa() {
			beasiswa = append(beasiswa, m)
		}
	}

	// Cache all filtered lists in parallel
	go func() { s.redisCache.Set(ctx, cache.KeyMahasiswaAktif, aktif) }()
	go func() { s.redisCache.Set(ctx, cache.KeyMahasiswaTidakAktif, tidakAktif) }()
	go func() { s.redisCache.Set(ctx, cache.KeyMahasiswaAlumni, alumni) }()
	go func() { s.redisCache.Set(ctx, cache.KeyMahasiswaBerprestasi, berprestasi) }()
	go func() { s.redisCache.Set(ctx, cache.KeyMahasiswaBeasiswa, beasiswa) }()

	log.Println("[Preload] All filtered caches warmed up")
}

// StartBackgroundRefresh periodically refreshes the cache before TTL expires
func (s *MahasiswaService) StartBackgroundRefresh(kodeFakultas string, angkatanFrom, angkatanTo int) {
	refreshInterval := s.memoryCache.ttl * 8 / 10 // Refresh at 80% of TTL
	if refreshInterval < 1*time.Minute {
		refreshInterval = 1 * time.Minute
	}

	go func() {
		ticker := time.NewTicker(refreshInterval)
		defer ticker.Stop()

		for range ticker.C {
			log.Println("[BackgroundRefresh] Refreshing cache...")
			// Invalidate memory cache to force refetch
			s.memoryCache.mu.Lock()
			s.memoryCache.timestamp = time.Time{}
			s.memoryCache.mu.Unlock()

			// Invalidate Redis cache
			s.redisCache.InvalidateAll(context.Background())

			// Refetch
			s.PreloadCache(kodeFakultas, angkatanFrom, angkatanTo)
		}
	}()

	log.Printf("[BackgroundRefresh] Started with interval %v", refreshInterval)
}

// GetAll returns all students with pagination
func (s *MahasiswaService) GetAll(kodeFakultas string, angkatanFrom, angkatanTo, limit, offset int) (*dto.MahasiswaListResponse, error) {
	data, err := s.fetchWithCache(kodeFakultas, angkatanFrom, angkatanTo)
	if err != nil {
		return nil, err
	}

	total := len(data)
	start := offset
	if start > total {
		start = total
	}
	end := start + limit
	if end > total {
		end = total
	}

	return &dto.MahasiswaListResponse{
		Data: dto.FromDomainList(data[start:end]),
		Pagination: dto.PaginationResponse{
			Total:  total,
			Limit:  limit,
			Offset: offset,
		},
	}, nil
}

// Search searches students by name or NIM
func (s *MahasiswaService) Search(kodeFakultas string, angkatanFrom, angkatanTo int, query string) ([]dto.MahasiswaResponse, error) {
	data, err := s.fetchWithCache(kodeFakultas, angkatanFrom, angkatanTo)
	if err != nil {
		return nil, err
	}

	query = strings.ToLower(query)
	var result []domain.Mahasiswa

	for _, m := range data {
		if strings.Contains(strings.ToLower(m.Nama), query) ||
			strings.Contains(strings.ToLower(m.NIM), query) {
			result = append(result, m)
		}
	}

	return dto.FromDomainList(result), nil
}

// GetAktif returns active students
func (s *MahasiswaService) GetAktif(kodeFakultas string, angkatanFrom, angkatanTo int) ([]dto.MahasiswaResponse, error) {
	// Try Redis cache for filtered result
	ctx := context.Background()
	cached, err := s.redisCache.Get(ctx, cache.KeyMahasiswaAktif)
	if err == nil && cached != nil {
		log.Println("Cache HIT: mahasiswa aktif (Redis)")
		return dto.FromDomainList(cached), nil
	}

	data, err := s.fetchWithCache(kodeFakultas, angkatanFrom, angkatanTo)
	if err != nil {
		return nil, err
	}

	var result []domain.Mahasiswa
	for _, m := range data {
		if m.IsAktif() {
			result = append(result, m)
		}
	}

	// Cache filtered result
	if cacheErr := s.redisCache.Set(ctx, cache.KeyMahasiswaAktif, result); cacheErr != nil {
		log.Printf("Warning: Failed to cache aktif: %v", cacheErr)
	}

	return dto.FromDomainList(result), nil
}

// GetTidakAktif returns inactive students
func (s *MahasiswaService) GetTidakAktif(kodeFakultas string, angkatanFrom, angkatanTo int) ([]dto.MahasiswaResponse, error) {
	ctx := context.Background()
	cached, err := s.redisCache.Get(ctx, cache.KeyMahasiswaTidakAktif)
	if err == nil && cached != nil {
		log.Println("Cache HIT: mahasiswa tidak aktif (Redis)")
		return dto.FromDomainList(cached), nil
	}

	data, err := s.fetchWithCache(kodeFakultas, angkatanFrom, angkatanTo)
	if err != nil {
		return nil, err
	}

	var result []domain.Mahasiswa
	for _, m := range data {
		if m.GetStatus() == domain.StatusTidakAktif {
			result = append(result, m)
		}
	}

	if cacheErr := s.redisCache.Set(ctx, cache.KeyMahasiswaTidakAktif, result); cacheErr != nil {
		log.Printf("Warning: Failed to cache tidak aktif: %v", cacheErr)
	}

	return dto.FromDomainList(result), nil
}

// GetAlumni returns alumni students
func (s *MahasiswaService) GetAlumni(kodeFakultas string, angkatanFrom, angkatanTo int) ([]dto.MahasiswaResponse, error) {
	ctx := context.Background()
	cached, err := s.redisCache.Get(ctx, cache.KeyMahasiswaAlumni)
	if err == nil && cached != nil {
		log.Println("Cache HIT: alumni (Redis)")
		return dto.FromDomainList(cached), nil
	}

	data, err := s.fetchWithCache(kodeFakultas, angkatanFrom, angkatanTo)
	if err != nil {
		return nil, err
	}

	var result []domain.Mahasiswa
	for _, m := range data {
		if m.IsAlumni() {
			result = append(result, m)
		}
	}

	if cacheErr := s.redisCache.Set(ctx, cache.KeyMahasiswaAlumni, result); cacheErr != nil {
		log.Printf("Warning: Failed to cache alumni: %v", cacheErr)
	}

	return dto.FromDomainList(result), nil
}

// GetBerprestasi returns high-achieving students
func (s *MahasiswaService) GetBerprestasi(kodeFakultas string, angkatanFrom, angkatanTo int) ([]dto.MahasiswaResponse, error) {
	ctx := context.Background()
	cached, err := s.redisCache.Get(ctx, cache.KeyMahasiswaBerprestasi)
	if err == nil && cached != nil {
		log.Println("Cache HIT: berprestasi (Redis)")
		return dto.FromDomainList(cached), nil
	}

	data, err := s.fetchWithCache(kodeFakultas, angkatanFrom, angkatanTo)
	if err != nil {
		return nil, err
	}

	var result []domain.Mahasiswa
	for _, m := range data {
		if m.IsBerprestasi() {
			result = append(result, m)
		}
	}

	sort.Slice(result, func(i, j int) bool {
		return result[i].IPK > result[j].IPK
	})

	if cacheErr := s.redisCache.Set(ctx, cache.KeyMahasiswaBerprestasi, result); cacheErr != nil {
		log.Printf("Warning: Failed to cache berprestasi: %v", cacheErr)
	}

	return dto.FromDomainList(result), nil
}

// GetBeasiswa returns scholarship-eligible students
func (s *MahasiswaService) GetBeasiswa(kodeFakultas string, angkatanFrom, angkatanTo int) ([]dto.MahasiswaResponse, error) {
	ctx := context.Background()
	cached, err := s.redisCache.Get(ctx, cache.KeyMahasiswaBeasiswa)
	if err == nil && cached != nil {
		log.Println("Cache HIT: beasiswa (Redis)")
		return dto.FromDomainList(cached), nil
	}

	data, err := s.fetchWithCache(kodeFakultas, angkatanFrom, angkatanTo)
	if err != nil {
		return nil, err
	}

	var result []domain.Mahasiswa
	for _, m := range data {
		if m.IsEligibleBeasiswa() {
			result = append(result, m)
		}
	}

	if cacheErr := s.redisCache.Set(ctx, cache.KeyMahasiswaBeasiswa, result); cacheErr != nil {
		log.Printf("Warning: Failed to cache beasiswa: %v", cacheErr)
	}

	return dto.FromDomainList(result), nil
}

// GetByAngkatan returns students by year
func (s *MahasiswaService) GetByAngkatan(kodeFakultas string, angkatanFrom, angkatanTo, angkatan int) ([]dto.MahasiswaResponse, error) {
	ctx := context.Background()
	cacheKey := fmt.Sprintf("%s%d", cache.KeyMahasiswaByAngkatan, angkatan)

	cached, err := s.redisCache.Get(ctx, cacheKey)
	if err == nil && cached != nil {
		log.Printf("Cache HIT: angkatan %d (Redis)", angkatan)
		return dto.FromDomainList(cached), nil
	}

	data, err := s.fetchWithCache(kodeFakultas, angkatanFrom, angkatanTo)
	if err != nil {
		return nil, err
	}

	var result []domain.Mahasiswa
	for _, m := range data {
		if m.Angkatan == angkatan {
			result = append(result, m)
		}
	}

	if cacheErr := s.redisCache.Set(ctx, cacheKey, result); cacheErr != nil {
		log.Printf("Warning: Failed to cache angkatan %d: %v", angkatan, cacheErr)
	}

	return dto.FromDomainList(result), nil
}

// GetByNIM returns a student by NIM (from the list data)
func (s *MahasiswaService) GetByNIM(kodeFakultas string, angkatanFrom, angkatanTo int, nim string) (*dto.MahasiswaResponse, error) {
	data, err := s.fetchWithCache(kodeFakultas, angkatanFrom, angkatanTo)
	if err != nil {
		return nil, err
	}

	for _, m := range data {
		if m.NIM == nim {
			resp := dto.FromDomain(&m)
			return &resp, nil
		}
	}

	return nil, nil
}

// GetDetailByNIM returns full student detail by NIM from GraphQL
func (s *MahasiswaService) GetDetailByNIM(nim string) (*dto.MahasiswaDetailResponse, error) {
	ctx := context.Background()

	// Try Redis cache first
	cacheKey := cache.KeyMahasiswaDetail + nim
	var cachedDetail dto.MahasiswaDetailResponse
	if err := s.redisCache.GetJSON(ctx, cacheKey, &cachedDetail); err == nil {
		log.Printf("Cache HIT: detail %s (Redis)", nim)
		return &cachedDetail, nil
	}

	// Fetch from GraphQL API
	log.Printf("Cache MISS: fetching detail for %s from GraphQL API...", nim)
	detail, err := s.repo.FetchMahasiswaByNIM(nim)
	if err != nil {
		return nil, err
	}
	if detail == nil {
		return nil, nil
	}

	result := dto.FromDetailDomain(detail)

	// Cache the result in Redis
	if cacheErr := s.redisCache.SetJSON(ctx, cacheKey, result); cacheErr != nil {
		log.Printf("Warning: Failed to cache detail %s: %v", nim, cacheErr)
	} else {
		log.Printf("Detail %s cached to Redis successfully", nim)
	}

	return result, nil
}

// GetStats returns student statistics
func (s *MahasiswaService) GetStats(kodeFakultas string, angkatanFrom, angkatanTo int) (*dto.StatsResponse, error) {
	// Try Redis cache
	ctx := context.Background()
	var cachedStats dto.StatsResponse
	if err := s.redisCache.GetJSON(ctx, cache.KeyMahasiswaStats, &cachedStats); err == nil {
		log.Println("Cache HIT: stats (Redis)")
		return &cachedStats, nil
	}

	// Try memory cache
	if memStats := s.memoryCache.getStats(); memStats != nil {
		if s.memoryCache.isValid() {
			log.Println("Cache HIT: stats (memory)")
			return memStats, nil
		}
	}

	// Compute from data
	data, err := s.fetchWithCache(kodeFakultas, angkatanFrom, angkatanTo)
	if err != nil {
		return nil, err
	}

	stats := s.computeStats(data)

	// Cache stats to Redis
	if cacheErr := s.redisCache.SetJSON(ctx, cache.KeyMahasiswaStats, stats); cacheErr != nil {
		log.Printf("Warning: Failed to cache stats: %v", cacheErr)
	}

	return stats, nil
}

// computeStats calculates statistics from data
func (s *MahasiswaService) computeStats(data []domain.Mahasiswa) *dto.StatsResponse {
	stats := &dto.StatsResponse{
		PerAngkatan: make(map[int]int),
	}

	var totalIPK float64
	for _, m := range data {
		stats.TotalMahasiswa++
		totalIPK += m.IPK

		switch m.GetStatus() {
		case domain.StatusAktif:
			stats.MahasiswaAktif++
		case domain.StatusTidakAktif:
			stats.MahasiswaTidakAktif++
		case domain.StatusAlumni:
			stats.Alumni++
		}

		if m.IsBerprestasi() {
			stats.Berprestasi++
		}

		stats.PerAngkatan[m.Angkatan]++
	}

	if stats.TotalMahasiswa > 0 {
		stats.RataRataIPK = totalIPK / float64(stats.TotalMahasiswa)
	}

	return stats
}

// ProsesSAW performs SAW analysis on students using 5 criteria
// Benefit criteria (higher = better): IPK, SKS Lulus, Matakuliah Lulus
// Cost criteria (lower = better): Jumlah MK Diulang, SKS MK Diulang
func (s *MahasiswaService) ProsesSAW(kodeFakultas string, angkatanFrom, angkatanTo int) ([]dto.HasilSAWResponse, error) {
	data, err := s.fetchWithCache(kodeFakultas, angkatanFrom, angkatanTo)
	if err != nil {
		return nil, err
	}

	var activeStudents []domain.Mahasiswa
	for _, m := range data {
		if m.IsAktif() {
			activeStudents = append(activeStudents, m)
		}
	}

	if len(activeStudents) == 0 {
		return []dto.HasilSAWResponse{}, nil
	}

	// Bobot (weights) for 5 criteria
	const (
		wIPK      = 0.30 // Benefit
		wSKSLulus = 0.20 // Benefit
		wMKLulus  = 0.15 // Benefit
		wMKUlang  = 0.20 // Cost (jumlah MK diulang)
		wSKSUlang = 0.15 // Cost (SKS MK diulang)
	)

	// Step 1: Find max benefit and min cost values for normalization
	var maxIPK float64
	var maxSKSLulus, maxMKLulus int
	var minMKUlang, minSKSUlang int

	// Initialize min values with large numbers
	minMKUlang = 999999
	minSKSUlang = 999999

	for _, m := range activeStudents {
		if m.IPK > maxIPK {
			maxIPK = m.IPK
		}
		if m.SKSLulus > maxSKSLulus {
			maxSKSLulus = m.SKSLulus
		}
		if m.MatakuliahLulus > maxMKLulus {
			maxMKLulus = m.MatakuliahLulus
		}
		if m.JumlahMatakuliahDiulang < minMKUlang {
			minMKUlang = m.JumlahMatakuliahDiulang
		}
		if m.SKSMatakuliahDiulang < minSKSUlang {
			minSKSUlang = m.SKSMatakuliahDiulang
		}
	}

	// Prevent division by zero
	if maxIPK == 0 {
		maxIPK = 4.0
	}
	if maxSKSLulus == 0 {
		maxSKSLulus = 1
	}
	if maxMKLulus == 0 {
		maxMKLulus = 1
	}

	// Step 2: Normalize and calculate SAW score
	type sawResult struct {
		mahasiswa domain.Mahasiswa
		nilai     float64
	}

	results := make([]sawResult, len(activeStudents))
	for i, m := range activeStudents {
		// Benefit normalization: r = x / max(x)
		rIPK := m.IPK / maxIPK
		rSKSLulus := float64(m.SKSLulus) / float64(maxSKSLulus)
		rMKLulus := float64(m.MatakuliahLulus) / float64(maxMKLulus)

		// Cost normalization: r = min(x) / x
		// If value is 0 (no repeats), that's the best case → score = 1.0
		var rMKUlang float64
		if m.JumlahMatakuliahDiulang == 0 {
			rMKUlang = 1.0
		} else {
			rMKUlang = float64(minMKUlang) / float64(m.JumlahMatakuliahDiulang)
			if minMKUlang == 0 {
				// If minimum is 0, students with repeats get penalized proportionally
				rMKUlang = 0.0
			}
		}

		var rSKSUlang float64
		if m.SKSMatakuliahDiulang == 0 {
			rSKSUlang = 1.0
		} else {
			rSKSUlang = float64(minSKSUlang) / float64(m.SKSMatakuliahDiulang)
			if minSKSUlang == 0 {
				rSKSUlang = 0.0
			}
		}

		// SAW score = sum of (weight * normalized value)
		nilai := rIPK*wIPK + rSKSLulus*wSKSLulus + rMKLulus*wMKLulus + rMKUlang*wMKUlang + rSKSUlang*wSKSUlang
		results[i] = sawResult{mahasiswa: m, nilai: nilai}
	}

	sort.Slice(results, func(i, j int) bool {
		return results[i].nilai > results[j].nilai
	})

	response := make([]dto.HasilSAWResponse, len(results))
	for i, r := range results {
		kategori := "Berisiko"
		if r.nilai >= 0.75 {
			kategori = "Berprestasi"
		} else if r.nilai >= 0.50 {
			kategori = "Normal"
		}

		response[i] = dto.HasilSAWResponse{
			NIM:                     r.mahasiswa.NIM,
			Nama:                    r.mahasiswa.Nama,
			IPK:                     r.mahasiswa.IPK,
			SKSTotal:                r.mahasiswa.SKSTotal,
			SKSDiambil:              r.mahasiswa.SKSDiambil,
			SKSLulus:                r.mahasiswa.SKSLulus,
			MatakuliahLulus:         r.mahasiswa.MatakuliahLulus,
			JumlahMatakuliahDiulang: r.mahasiswa.JumlahMatakuliahDiulang,
			SKSMatakuliahDiulang:    r.mahasiswa.SKSMatakuliahDiulang,
			Angkatan:                r.mahasiswa.Angkatan,
			Nilai:                   r.nilai,
			Kategori:                kategori,
			Ranking:                 i + 1,
			Jurusan:                 r.mahasiswa.Jurusan,
		}
	}

	return response, nil
}

// fetchWithCache fetches all data with Redis -> memory -> API fallback
func (s *MahasiswaService) fetchWithCache(kodeFakultas string, angkatanFrom, angkatanTo int) ([]domain.Mahasiswa, error) {
	ctx := context.Background()

	// 1. Try Redis cache
	cached, err := s.redisCache.Get(ctx, cache.KeyAllMahasiswa)
	if err == nil && cached != nil {
		log.Printf("Cache HIT: all mahasiswa (Redis, %d records)", len(cached))
		return cached, nil
	}

	// 2. Try memory cache
	if s.memoryCache.isValid() {
		data := s.memoryCache.getData()
		if data != nil {
			log.Printf("Cache HIT: all mahasiswa (memory, %d records)", len(data))
			return data, nil
		}
	}

	// 3. Singleflight: only one goroutine fetches, others wait
	s.fetchMu.Lock()
	if s.fetching {
		// Another goroutine is already fetching, wait for it
		waitCh := s.fetchDone
		s.fetchMu.Unlock()
		log.Println("Waiting for in-flight fetch to complete...")
		<-waitCh
		// After wait, data should be in cache now
		if s.memoryCache.isValid() {
			data := s.memoryCache.getData()
			if data != nil {
				log.Printf("Cache HIT after wait: all mahasiswa (memory, %d records)", len(data))
				return data, nil
			}
		}
		return nil, fmt.Errorf("data not available after waiting for fetch")
	}
	// Mark as fetching
	s.fetching = true
	s.fetchDone = make(chan struct{})
	s.fetchMu.Unlock()

	defer func() {
		s.fetchMu.Lock()
		s.fetching = false
		close(s.fetchDone)
		s.fetchMu.Unlock()
	}()

	// 4. Fetch from GraphQL API (parallel per-prodi)
	log.Println("Cache MISS: fetching from GraphQL API...")
	data, err := s.repo.FetchMahasiswaAll(kodeFakultas, angkatanFrom, angkatanTo, 100000000, 0)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch from API: %w", err)
	}
	log.Printf("Fetched %d mahasiswa from GraphQL API", len(data))

	// Precompute stats
	stats := s.computeStats(data)

	// 5. Store in Redis
	if cacheErr := s.redisCache.Set(ctx, cache.KeyAllMahasiswa, data); cacheErr != nil {
		log.Printf("Warning: Redis cache set failed: %v", cacheErr)
	} else {
		log.Println("Data cached to Redis successfully")
	}

	// Also cache stats to Redis
	if cacheErr := s.redisCache.SetJSON(ctx, cache.KeyMahasiswaStats, stats); cacheErr != nil {
		log.Printf("Warning: Redis stats cache failed: %v", cacheErr)
	}

	// 6. Store in memory (always works)
	s.memoryCache.store(data, stats)
	log.Println("Data cached to memory successfully")

	return data, nil
}
