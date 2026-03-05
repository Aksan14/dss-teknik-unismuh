package repository

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net"
	"net/http"
	"sync"
	"time"

	"github.com/unismuh/sipema/internal/domain"
)

// GraphQLRepository handles GraphQL API communication
type GraphQLRepository struct {
	endpoint   string
	httpClient *http.Client
}

// graphqlRequest represents a GraphQL request body
type graphqlRequest struct {
	Query     string                 `json:"query"`
	Variables map[string]interface{} `json:"variables,omitempty"`
}

// graphqlResponse represents a GraphQL response
type graphqlResponse struct {
	Data   json.RawMessage `json:"data"`
	Errors []struct {
		Message string `json:"message"`
	} `json:"errors,omitempty"`
}

// mahasiswaAllResponse represents the GraphQL response structure
type mahasiswaAllResponse struct {
	MahasiswaAll []struct {
		NIM                     string  `json:"nim"`
		Nama                    string  `json:"nama"`
		IPK                     float64 `json:"ipk"`
		Angkatan                int     `json:"angkatan"`
		SKSTotal                int     `json:"sksTotal"`
		SKSDiambil              int     `json:"sksDiambil"`
		SKSLulus                int     `json:"sksLulus"`
		MatakuliahLulus         int     `json:"matakuliahLulus"`
		JumlahMatakuliahDiulang int     `json:"jumlahMatakuliahDiulang"`
		SKSMatakuliahDiulang    int     `json:"sksMatakuliahDiulang"`
	} `json:"mahasiswaAll"`
}

// NewGraphQLRepository creates a new GraphQL repository
func NewGraphQLRepository(endpoint string) *GraphQLRepository {
	// Optimized HTTP transport with connection pooling and keep-alive
	transport := &http.Transport{
		MaxIdleConns:        20,
		MaxIdleConnsPerHost: 10,
		IdleConnTimeout:     120 * time.Second,
		DisableCompression:  false,
		DialContext: (&net.Dialer{
			Timeout:   10 * time.Second,
			KeepAlive: 30 * time.Second,
		}).DialContext,
	}

	return &GraphQLRepository{
		endpoint: endpoint,
		httpClient: &http.Client{
			Timeout:   60 * time.Second,
			Transport: transport,
		},
	}
}

// FetchMahasiswaAll fetches all students from the GraphQL API, querying per prodi
func (r *GraphQLRepository) FetchMahasiswaAll(kodeFakultas string, angkatanFrom, angkatanTo, limit, offset int) ([]domain.Mahasiswa, error) {
	query := `
		query MahasiswaAll($kodeFakultas: String!, $kodeProdi: String!, $angkatanFrom: Int!, $angkatanTo: Int!, $limit: Int!, $offset: Int!) {
			mahasiswaAll(
				kodeFakultas: $kodeFakultas
				kodeProdi: $kodeProdi
				angkatanFrom: $angkatanFrom
				angkatanTo: $angkatanTo
				limit: $limit
				offset: $offset
			) {
				nim
				nama
				ipk
				angkatan
				sksTotal
				sksDiambil
				sksLulus
				matakuliahLulus
				jumlahMatakuliahDiulang
				sksMatakuliahDiulang
			}
		}
	`

	var allMahasiswa []domain.Mahasiswa
	var mu sync.Mutex
	var wg sync.WaitGroup
	var firstErr error

	for kodeProdi, namaProdi := range domain.ProdiMapping {
		wg.Add(1)
		go func(kodeProdi, namaProdi string) {
			defer wg.Done()

			variables := map[string]interface{}{
				"kodeFakultas": kodeFakultas,
				"kodeProdi":    kodeProdi,
				"angkatanFrom": angkatanFrom,
				"angkatanTo":   angkatanTo,
				"limit":        limit,
				"offset":       offset,
			}

			resp, err := r.execute(query, variables)
			if err != nil {
				mu.Lock()
				if firstErr == nil {
					firstErr = fmt.Errorf("failed to fetch mahasiswa prodi %s (%s): %w", kodeProdi, namaProdi, err)
				}
				mu.Unlock()
				return
			}

			var result mahasiswaAllResponse
			if err := json.Unmarshal(resp.Data, &result); err != nil {
				mu.Lock()
				if firstErr == nil {
					firstErr = fmt.Errorf("failed to parse response for prodi %s: %w", kodeProdi, err)
				}
				mu.Unlock()
				return
			}

			batch := make([]domain.Mahasiswa, 0, len(result.MahasiswaAll))
			for _, m := range result.MahasiswaAll {
				batch = append(batch, domain.Mahasiswa{
					NIM:                     m.NIM,
					Nama:                    m.Nama,
					IPK:                     m.IPK,
					Angkatan:                m.Angkatan,
					SKSTotal:                m.SKSTotal,
					SKSDiambil:              m.SKSDiambil,
					SKSLulus:                m.SKSLulus,
					MatakuliahLulus:         m.MatakuliahLulus,
					JumlahMatakuliahDiulang: m.JumlahMatakuliahDiulang,
					SKSMatakuliahDiulang:    m.SKSMatakuliahDiulang,
					Jurusan:                 namaProdi,
				})
			}

			log.Printf("Fetched %d mahasiswa from prodi %s (%s)", len(batch), kodeProdi, namaProdi)

			mu.Lock()
			allMahasiswa = append(allMahasiswa, batch...)
			mu.Unlock()
		}(kodeProdi, namaProdi)
	}

	wg.Wait()

	if firstErr != nil {
		return nil, firstErr
	}

	return allMahasiswa, nil
}

// FetchMahasiswaByNIM fetches a single student with full detail by NIM
func (r *GraphQLRepository) FetchMahasiswaByNIM(nim string) (*domain.MahasiswaDetail, error) {
	query := `
		query GetMahasiswa($nim: String!) {
			mahasiswa(nim: $nim) {
				nim
				kodeProdi
				angkatan
				nama
				jenisKelamin
				tempatLahir
				tanggalLahir
				nik
				hp
				email
				semesterAwal
				tahunAkademikLulus
				tanggalLulus
				lulus
				noSeriIjazah
				masaStudi

				ayah {
					nim
					nik
					nama
					alamat
					hp
					email
					pendidikan
					pekerjaan
					instansi
					jabatan
					penghasilan
					status
				}

				ibu {
					nim
					nik
					nama
					alamat
					hp
					email
					pendidikan
					pekerjaan
					instansi
					jabatan
					penghasilan
					status
				}

				wali {
					nim
					nama
					alamat
					hp
					email
					pendidikan
					pekerjaan
					instansi
					jabatan
					penghasilan
				}

				khs {
					tahunAkademik
					totalSksLulus
					ips
					ipk
					statusKelulusan
					jumlahMatakuliah
					sksDiambil
					sksLulus
					matakuliahLulus
					jumlahMatakuliahDiulang
					sksMatakuliahDiulang
				}

				dosenPenasehat {
					nidn
					nama
					gelar_depan
					gelar_belakang
					email
					prodiId
				}

				prodi {
					id
					kodeFakultas
					kodeProdi
					namaProdi
					namaProdiEng
					statusProdi
					emailProdi
					kodeNim
					gelarPendek
					gelarPanjang
					gelarEng
				}
			}
		}
	`

	variables := map[string]interface{}{
		"nim": nim,
	}

	resp, err := r.execute(query, variables)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch mahasiswa detail: %w", err)
	}

	var result struct {
		Mahasiswa *domain.MahasiswaDetail `json:"mahasiswa"`
	}
	if err := json.Unmarshal(resp.Data, &result); err != nil {
		return nil, fmt.Errorf("failed to parse mahasiswa detail response: %w", err)
	}

	return result.Mahasiswa, nil
}

// execute sends a GraphQL request and returns the response
func (r *GraphQLRepository) execute(query string, variables map[string]interface{}) (*graphqlResponse, error) {
	reqBody := graphqlRequest{
		Query:     query,
		Variables: variables,
	}

	jsonBody, err := json.Marshal(reqBody)
	if err != nil {
		return nil, fmt.Errorf("failed to marshal request: %w", err)
	}

	req, err := http.NewRequest("POST", r.endpoint, bytes.NewBuffer(jsonBody))
	if err != nil {
		return nil, fmt.Errorf("failed to create request: %w", err)
	}

	req.Header.Set("Content-Type", "application/json")
	req.Header.Set("Accept", "application/json")

	resp, err := r.httpClient.Do(req)
	if err != nil {
		return nil, fmt.Errorf("failed to execute request: %w", err)
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %w", err)
	}

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status code: %d, body: %s", resp.StatusCode, string(body))
	}

	var gqlResp graphqlResponse
	if err := json.Unmarshal(body, &gqlResp); err != nil {
		return nil, fmt.Errorf("failed to unmarshal response: %w", err)
	}

	if len(gqlResp.Errors) > 0 {
		return nil, fmt.Errorf("graphql error: %s", gqlResp.Errors[0].Message)
	}

	return &gqlResp, nil
}
