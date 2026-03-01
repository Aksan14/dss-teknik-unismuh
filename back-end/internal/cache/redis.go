package cache

import (
	"context"
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/redis/go-redis/v9"
	"github.com/unismuh/sipema/internal/domain"
)

// Cache keys
const (
	KeyAllMahasiswa         = "sipema:mahasiswa:all"
	KeyMahasiswaAktif       = "sipema:mahasiswa:aktif"
	KeyMahasiswaTidakAktif  = "sipema:mahasiswa:tidak_aktif"
	KeyMahasiswaAlumni      = "sipema:mahasiswa:alumni"
	KeyMahasiswaBerprestasi = "sipema:mahasiswa:berprestasi"
	KeyMahasiswaBeasiswa    = "sipema:mahasiswa:beasiswa"
	KeyMahasiswaStats       = "sipema:mahasiswa:stats"
	KeyMahasiswaByAngkatan  = "sipema:mahasiswa:angkatan:"
	KeyMahasiswaDetail      = "sipema:mahasiswa:detail:" // + NIM
)

// RedisCache provides Redis-based caching with connection state tracking
type RedisCache struct {
	client        *redis.Client
	ttl           time.Duration
	connected     bool
	mu            sync.RWMutex
	lastCheck     time.Time
	checkInterval time.Duration
}

// NewRedisCache creates a new Redis cache instance
func NewRedisCache(addr, password string, db int, ttlMinutes int) *RedisCache {
	client := redis.NewClient(&redis.Options{
		Addr:         addr,
		Password:     password,
		DB:           db,
		DialTimeout:  3 * time.Second,
		ReadTimeout:  2 * time.Second,
		WriteTimeout: 2 * time.Second,
		PoolSize:     10,
	})

	rc := &RedisCache{
		client:        client,
		ttl:           time.Duration(ttlMinutes) * time.Minute,
		checkInterval: 30 * time.Second,
	}

	// Test initial connection
	ctx, cancel := context.WithTimeout(context.Background(), 3*time.Second)
	defer cancel()

	if err := client.Ping(ctx).Err(); err != nil {
		log.Printf("Warning: Redis connection failed: %v. Using memory cache only.", err)
		rc.connected = false
	} else {
		log.Printf("Redis connected successfully at %s (TTL: %d min)", addr, ttlMinutes)
		rc.connected = true
	}
	rc.lastCheck = time.Now()

	return rc
}

// IsConnected returns cached connection status, only re-checks periodically
func (c *RedisCache) IsConnected() bool {
	if c == nil || c.client == nil {
		return false
	}

	c.mu.RLock()
	if time.Since(c.lastCheck) < c.checkInterval {
		connected := c.connected
		c.mu.RUnlock()
		return connected
	}
	c.mu.RUnlock()

	// Time to re-check connection
	c.mu.Lock()
	defer c.mu.Unlock()

	// Double-check after acquiring write lock
	if time.Since(c.lastCheck) < c.checkInterval {
		return c.connected
	}

	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	c.connected = c.client.Ping(ctx).Err() == nil
	c.lastCheck = time.Now()

	if c.connected {
		log.Println("Redis: connection OK")
	} else {
		log.Println("Redis: connection lost, using memory cache")
	}

	return c.connected
}

// Get retrieves mahasiswa list from cache
func (c *RedisCache) Get(ctx context.Context, key string) ([]domain.Mahasiswa, error) {
	if c == nil || !c.IsConnected() {
		return nil, nil
	}

	data, err := c.client.Get(ctx, key).Bytes()
	if err == redis.Nil {
		return nil, nil
	}
	if err != nil {
		c.markDisconnected()
		return nil, err
	}

	var result []domain.Mahasiswa
	if err := json.Unmarshal(data, &result); err != nil {
		return nil, err
	}

	return result, nil
}

// Set stores mahasiswa list in cache
func (c *RedisCache) Set(ctx context.Context, key string, data []domain.Mahasiswa) error {
	if c == nil || !c.IsConnected() {
		return nil
	}

	jsonData, err := json.Marshal(data)
	if err != nil {
		return err
	}

	if err := c.client.Set(ctx, key, jsonData, c.ttl).Err(); err != nil {
		c.markDisconnected()
		return err
	}
	return nil
}

// GetJSON retrieves any JSON-serializable type from cache
func (c *RedisCache) GetJSON(ctx context.Context, key string, dest interface{}) error {
	if c == nil || !c.IsConnected() {
		return redis.Nil
	}

	data, err := c.client.Get(ctx, key).Bytes()
	if err != nil {
		if err != redis.Nil {
			c.markDisconnected()
		}
		return err
	}

	return json.Unmarshal(data, dest)
}

// SetJSON stores any JSON-serializable type in cache
func (c *RedisCache) SetJSON(ctx context.Context, key string, data interface{}) error {
	if c == nil || !c.IsConnected() {
		return nil
	}

	jsonData, err := json.Marshal(data)
	if err != nil {
		return err
	}

	if err := c.client.Set(ctx, key, jsonData, c.ttl).Err(); err != nil {
		c.markDisconnected()
		return err
	}
	return nil
}

// InvalidateAll clears all sipema cache keys
func (c *RedisCache) InvalidateAll(ctx context.Context) error {
	if c == nil || !c.IsConnected() {
		return nil
	}

	keys, err := c.client.Keys(ctx, "sipema:*").Result()
	if err != nil {
		return err
	}
	if len(keys) > 0 {
		return c.client.Del(ctx, keys...).Err()
	}
	return nil
}

// Close closes the Redis connection
func (c *RedisCache) Close() error {
	if c == nil || c.client == nil {
		return nil
	}
	return c.client.Close()
}

// markDisconnected marks Redis as disconnected after an error
func (c *RedisCache) markDisconnected() {
	c.mu.Lock()
	c.connected = false
	c.lastCheck = time.Now()
	c.mu.Unlock()
}
