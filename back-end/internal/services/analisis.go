package services

import (
	"fmt"
	"math"
	"strings"
	"time"

	"github.com/unismuh/sipema/internal/dto"
)

const (
	TotalSKSWajib = 156 // Total required SKS for graduation
	SemesterIdeal = 8   // Ideal semesters for graduation (4 years)
	MaxMK         = 60  // Reference max for normalization
)

// ComputeAnalisis calculates all analysis fields for a student detail response
func ComputeAnalisis(resp *dto.MahasiswaDetailResponse) *dto.AnalisisResponse {
	if resp == nil {
		return nil
	}

	analisis := &dto.AnalisisResponse{}

	// Basic calculations
	tahunSekarang := time.Now().Year()
	analisis.TahunStudi = tahunSekarang - resp.Angkatan
	analisis.SemesterAktif = len(resp.KHS)

	// SKS Total should be at least TotalSKSWajib for calculation purposes
	sksTotal := resp.SKSTotal
	if sksTotal == 0 {
		sksTotal = TotalSKSWajib
	}

	// Progress & Efficiency
	if sksTotal > 0 {
		analisis.ProgressSKS = math.Min((float64(resp.SKSLulus)/float64(sksTotal))*100, 100)
	}
	if resp.SKSDiambil > 0 {
		analisis.Efisiensi = (float64(resp.SKSLulus) / float64(resp.SKSDiambil)) * 100
		analisis.RasioUlang = (float64(resp.SKSMKDiulang) / float64(resp.SKSDiambil)) * 100
		analisis.TingkatKelulusan = analisis.Efisiensi
	}
	if analisis.SemesterAktif > 0 {
		analisis.SKSPerSemester = float64(resp.SKSLulus) / float64(analisis.SemesterAktif)
		analisis.MKLulusPerSem = float64(resp.MatakuliahLulus) / float64(analisis.SemesterAktif)
	}

	// IPS Statistics
	analisis.IPSStats = computeIPSStats(resp.KHS)

	// SKS by semester type (Ganjil/Genap)
	analisis.SKSGanjil, analisis.SKSGenap = computeSKSBySemesterType(resp.KHS)

	// Predictions
	analisis.SKSSisa = int(math.Max(float64(TotalSKSWajib-resp.SKSLulus), 0))
	if analisis.SKSPerSemester > 0 && analisis.SKSSisa > 0 {
		analisis.SemesterSisa = int(math.Ceil(float64(analisis.SKSSisa) / analisis.SKSPerSemester))
		if resp.Lulus {
			analisis.EstimasiLulus = "Sudah Lulus"
		} else {
			analisis.EstimasiLulus = fmt.Sprintf("~%d semester lagi", analisis.SemesterSisa)
		}
		// Calculate estimated graduation date
		bulanTambahan := analisis.SemesterSisa * 6
		estimasiDate := time.Now().AddDate(0, bulanTambahan, 0)
		analisis.EstimasiBulanTahun = formatIndonesianDate(estimasiDate)
	} else if resp.Lulus {
		analisis.EstimasiLulus = "Sudah Lulus"
	} else {
		analisis.EstimasiLulus = "Tidak dapat diprediksi"
	}

	// SKS per semester needed for ideal graduation
	semesterSisaIdeal := int(math.Max(float64(SemesterIdeal-analisis.SemesterAktif), 0))
	if semesterSisaIdeal > 0 {
		analisis.SKSPerSemIdeal = int(math.Ceil(float64(analisis.SKSSisa) / float64(semesterSisaIdeal)))
	}

	// SAW Analysis
	analisis.NilaiSAW = computeSAW(resp)

	// Academic Health Score
	analisis.SkorAkademik, analisis.SkorAkademikLabel = computeHealthScore(resp, analisis)

	// Status Flags
	if !resp.Lulus && analisis.SemesterAktif <= SemesterIdeal {
		expectedProgress := (float64(analisis.SemesterAktif) / float64(SemesterIdeal)) * 100 * 0.8
		analisis.IsOnTrack = analisis.ProgressSKS >= expectedProgress
	}
	analisis.RiskDO = resp.IPK < 2.0 && analisis.TahunStudi > 5 && !resp.Lulus
	analisis.BisaCumLaude = resp.IPK >= 3.5 && resp.JumlahMKDiulang == 0

	// Problems
	analisis.Masalah = computeMasalah(resp, analisis)

	// Achievements
	analisis.Prestasi = computePrestasi(resp, analisis)

	// Recommendations
	analisis.Rekomendasi = computeRekomendasi(resp, analisis)

	// Q&A
	analisis.TanyaJawab = computeTanyaJawab(resp, analisis)

	return analisis
}

// computeIPSStats calculates IPS statistics from KHS data
func computeIPSStats(khs []dto.KHSResponse) dto.IPSStatsResponse {
	stats := dto.IPSStatsResponse{Trend: "stable"}

	if len(khs) == 0 {
		return stats
	}

	var total float64
	stats.Min = 4.0
	stats.Max = 0.0

	for _, k := range khs {
		total += k.IPS
		if k.IPS > stats.Max {
			stats.Max = k.IPS
		}
		if k.IPS < stats.Min {
			stats.Min = k.IPS
		}
	}

	stats.Average = total / float64(len(khs))
	stats.Last = khs[len(khs)-1].IPS

	// Determine trend
	if len(khs) >= 2 {
		prevIPS := khs[len(khs)-2].IPS
		if stats.Last > prevIPS+0.1 {
			stats.Trend = "up"
		} else if stats.Last < prevIPS-0.1 {
			stats.Trend = "down"
		}
	}

	return stats
}

// computeSKSBySemesterType calculates SKS per semester type (Ganjil/Genap)
// TahunAkademik format: "2023/2024 Ganjil" or "2023/2024 Genap"
func computeSKSBySemesterType(khs []dto.KHSResponse) (sksGanjil, sksGenap int) {
	for _, k := range khs {
		// Check if it's Ganjil or Genap semester
		if strings.Contains(strings.ToLower(k.TahunAkademik), "ganjil") {
			sksGanjil += k.SksLulus
		} else if strings.Contains(strings.ToLower(k.TahunAkademik), "genap") {
			sksGenap += k.SksLulus
		}
	}
	return sksGanjil, sksGenap
}

// computeSAW calculates SAW (Simple Additive Weighting) value
func computeSAW(resp *dto.MahasiswaDetailResponse) float64 {
	// 5 criteria: IPK(30% benefit), SKS Lulus(20% benefit), MK Lulus(15% benefit),
	//             MK Diulang(20% cost), SKS MK Diulang(15% cost)
	totalSksWajib := float64(resp.SKSTotal)
	if totalSksWajib == 0 {
		totalSksWajib = TotalSKSWajib
	}

	// Normalized values (0-1)
	normIpk := resp.IPK / 4.0
	normSksLulus := math.Min(float64(resp.SKSLulus)/totalSksWajib, 1)
	normMkLulus := math.Min(float64(resp.MatakuliahLulus)/float64(MaxMK), 1)

	// Cost criteria: lower is better -> invert
	var normMkDiulang float64 = 1
	if resp.JumlahMKDiulang > 0 {
		normMkDiulang = 1 - math.Min(float64(resp.JumlahMKDiulang)/10.0, 1)
	}
	var normSksMkDiulang float64 = 1
	if resp.SKSMKDiulang > 0 {
		normSksMkDiulang = 1 - math.Min(float64(resp.SKSMKDiulang)/30.0, 1)
	}

	return normIpk*0.30 + normSksLulus*0.20 + normMkLulus*0.15 + normMkDiulang*0.20 + normSksMkDiulang*0.15
}

// computeHealthScore calculates academic health score (0-100)
func computeHealthScore(resp *dto.MahasiswaDetailResponse, analisis *dto.AnalisisResponse) (int, string) {
	skor := 50

	// IPK contribution
	if resp.IPK >= 3.5 {
		skor += 20
	} else if resp.IPK >= 3.0 {
		skor += 15
	} else if resp.IPK >= 2.5 {
		skor += 5
	} else if resp.IPK >= 2.0 {
		skor -= 5
	} else {
		skor -= 15
	}

	// MK diulang contribution
	if resp.JumlahMKDiulang == 0 {
		skor += 15
	} else if resp.JumlahMKDiulang <= 2 {
		skor += 5
	} else if resp.JumlahMKDiulang <= 4 {
		skor -= 5
	} else {
		skor -= 15
	}

	// Progress contribution
	if analisis.ProgressSKS >= 80 {
		skor += 10
	} else if analisis.ProgressSKS >= 50 {
		skor += 5
	} else {
		skor -= 5
	}

	// Efficiency contribution
	if analisis.Efisiensi >= 90 {
		skor += 5
	} else if analisis.Efisiensi < 75 {
		skor -= 5
	}

	// Trend contribution
	switch analisis.IPSStats.Trend {
	case "up":
		skor += 5
	case "down":
		skor -= 5
	}

	// Clamp to 0-100
	if skor < 0 {
		skor = 0
	} else if skor > 100 {
		skor = 100
	}

	// Label
	var label string
	switch {
	case skor >= 80:
		label = "Sangat Baik"
	case skor >= 60:
		label = "Baik"
	case skor >= 40:
		label = "Cukup"
	case skor >= 20:
		label = "Kurang"
	default:
		label = "Kritis"
	}

	return skor, label
}

// computeMasalah identifies academic problems
func computeMasalah(resp *dto.MahasiswaDetailResponse, analisis *dto.AnalisisResponse) []dto.MasalahResponse {
	var masalah []dto.MasalahResponse

	// IPK problems
	if resp.IPK < 2.0 {
		masalah = append(masalah, dto.MasalahResponse{
			Text:     fmt.Sprintf("IPK sangat rendah (%.2f)", resp.IPK),
			Severity: "high",
		})
	} else if resp.IPK < 2.5 {
		masalah = append(masalah, dto.MasalahResponse{
			Text:     fmt.Sprintf("IPK di bawah standar (%.2f)", resp.IPK),
			Severity: "medium",
		})
	}

	// MK diulang problems
	if resp.JumlahMKDiulang >= 5 {
		masalah = append(masalah, dto.MasalahResponse{
			Text:     fmt.Sprintf("%d MK diulang — banyak pengulangan", resp.JumlahMKDiulang),
			Severity: "high",
		})
	} else if resp.JumlahMKDiulang >= 3 {
		masalah = append(masalah, dto.MasalahResponse{
			Text:     fmt.Sprintf("%d MK diulang", resp.JumlahMKDiulang),
			Severity: "medium",
		})
	}

	// SKS MK diulang problems
	if resp.SKSMKDiulang >= 15 {
		masalah = append(masalah, dto.MasalahResponse{
			Text:     fmt.Sprintf("%d SKS MK diulang (tinggi)", resp.SKSMKDiulang),
			Severity: "high",
		})
	} else if resp.SKSMKDiulang >= 8 {
		masalah = append(masalah, dto.MasalahResponse{
			Text:     fmt.Sprintf("%d SKS MK diulang", resp.SKSMKDiulang),
			Severity: "medium",
		})
	}

	// Study duration problems
	if analisis.TahunStudi > 6 {
		masalah = append(masalah, dto.MasalahResponse{
			Text:     fmt.Sprintf("Masa studi %d tahun — sangat lama", analisis.TahunStudi),
			Severity: "high",
		})
	} else if analisis.TahunStudi > 5 {
		masalah = append(masalah, dto.MasalahResponse{
			Text:     fmt.Sprintf("Masa studi %d tahun — melebihi batas normal", analisis.TahunStudi),
			Severity: "medium",
		})
	}

	// Efficiency problems
	if analisis.Efisiensi < 70 && resp.SKSDiambil > 0 {
		masalah = append(masalah, dto.MasalahResponse{
			Text:     fmt.Sprintf("Efisiensi SKS rendah (%.0f%%)", analisis.Efisiensi),
			Severity: "medium",
		})
	}

	// Trend problems
	if analisis.IPSStats.Trend == "down" {
		masalah = append(masalah, dto.MasalahResponse{
			Text:     "Tren IPS menurun",
			Severity: "low",
		})
	}

	// Progress problems
	expectedProg := math.Min((float64(analisis.TahunStudi)/4.0)*100, 100)
	if resp.SKSTotal > 0 {
		if analisis.ProgressSKS < expectedProg*0.5 {
			masalah = append(masalah, dto.MasalahResponse{
				Text:     "Progress SKS sangat lambat",
				Severity: "high",
			})
		} else if analisis.ProgressSKS < expectedProg*0.7 {
			masalah = append(masalah, dto.MasalahResponse{
				Text:     "Progress SKS lambat",
				Severity: "medium",
			})
		}
	}

	return masalah
}

// computePrestasi identifies achievements
func computePrestasi(resp *dto.MahasiswaDetailResponse, analisis *dto.AnalisisResponse) []string {
	var prestasi []string

	// IPK achievements
	if resp.IPK >= 3.75 {
		prestasi = append(prestasi, "Kandidat Cum Laude")
	} else if resp.IPK >= 3.5 {
		prestasi = append(prestasi, "IPK Sangat Memuaskan")
	} else if resp.IPK >= 3.0 {
		prestasi = append(prestasi, "IPK Memuaskan")
	}

	// No repeated courses
	if resp.JumlahMKDiulang == 0 && resp.SKSDiambil > 0 {
		prestasi = append(prestasi, "Tidak ada MK diulang")
	}

	// Near graduation
	if analisis.ProgressSKS >= 90 && !resp.Lulus {
		prestasi = append(prestasi, "Hampir menyelesaikan studi")
	}

	// Rising trend
	if analisis.IPSStats.Trend == "up" {
		prestasi = append(prestasi, "Tren IPS meningkat")
	}

	// High efficiency
	if analisis.Efisiensi >= 95 && resp.SKSDiambil > 0 {
		prestasi = append(prestasi, "Efisiensi SKS sangat baik")
	}

	// Graduated
	if resp.Lulus {
		prestasi = append(prestasi, "Telah menyelesaikan studi")
	}

	// High IPS
	if analisis.IPSStats.Max >= 3.8 {
		prestasi = append(prestasi, fmt.Sprintf("IPS tertinggi: %.2f", analisis.IPSStats.Max))
	}

	return prestasi
}

// computeRekomendasi generates recommendations
func computeRekomendasi(resp *dto.MahasiswaDetailResponse, analisis *dto.AnalisisResponse) []string {
	var rekomendasi []string

	// Low IPK
	if resp.IPK < 2.5 && resp.IPK > 0 {
		rekomendasi = append(rekomendasi, "Perlu konsultasi intensif dengan Dosen PA untuk perbaikan strategi belajar")
	}

	// Many repeated courses
	if resp.JumlahMKDiulang > 3 {
		rekomendasi = append(rekomendasi, "Fokus prioritaskan mata kuliah yang diulang agar tidak menumpuk")
	}

	// Long study duration
	if analisis.TahunStudi > 5 && !resp.Lulus {
		rekomendasi = append(rekomendasi, "Segera susun rencana penyelesaian studi dengan pembimbing akademik")
	}

	// Declining trend
	if analisis.IPSStats.Trend == "down" {
		rekomendasi = append(rekomendasi, "Evaluasi faktor penyebab penurunan IPS dan lakukan perbaikan")
	}

	// Low efficiency
	if analisis.Efisiensi < 80 && resp.SKSDiambil > 0 {
		rekomendasi = append(rekomendasi, "Tingkatkan tingkat kelulusan mata kuliah yang diambil")
	}

	// High achiever
	if resp.IPK >= 3.5 && resp.JumlahMKDiulang == 0 {
		rekomendasi = append(rekomendasi, "Pertahankan performa, pertimbangkan ikut kompetisi akademik")
	}

	// Near graduation
	if analisis.ProgressSKS >= 80 && !resp.Lulus {
		rekomendasi = append(rekomendasi, "Segera selesaikan tugas akhir/skripsi")
	}

	// Default recommendation
	if len(rekomendasi) == 0 {
		rekomendasi = append(rekomendasi, "Tetap konsisten dan jaga performa akademik saat ini")
	}

	return rekomendasi
}

// computeTanyaJawab generates Q&A about the student
func computeTanyaJawab(resp *dto.MahasiswaDetailResponse, analisis *dto.AnalisisResponse) []dto.TanyaJawabResponse {
	var qa []dto.TanyaJawabResponse

	// Q: Graduation status
	if resp.Lulus {
		answer := "Ya, mahasiswa telah menyelesaikan studi"
		if resp.TanggalLulus != "" {
			answer += " pada " + resp.TanggalLulus
		}
		if resp.TahunAkademikLulus != "" {
			answer += fmt.Sprintf(" (tahun akademik %s)", resp.TahunAkademikLulus)
		}
		if resp.MasaStudi != "" {
			answer += " dengan masa studi " + resp.MasaStudi
		}
		answer += fmt.Sprintf(". IPK akhir: %.2f.", resp.IPK)
		qa = append(qa, dto.TanyaJawabResponse{
			Question: "Apakah mahasiswa ini sudah lulus?",
			Answer:   answer,
			Color:    "green",
		})
	} else if analisis.SKSPerSemester > 0 && analisis.SKSSisa > 0 {
		answer := fmt.Sprintf("Dengan rata-rata %.1f SKS per semester, mahasiswa membutuhkan sekitar %d semester lagi (~%.1f tahun) untuk menyelesaikan sisa %d SKS dari total %d SKS.",
			analisis.SKSPerSemester, analisis.SemesterSisa, float64(analisis.SemesterSisa)/2.0, analisis.SKSSisa, TotalSKSWajib)
		if analisis.EstimasiBulanTahun != "" {
			answer += " Estimasi lulus sekitar " + analisis.EstimasiBulanTahun + "."
		}
		color := "orange"
		if analisis.SemesterSisa <= 2 {
			color = "green"
		} else if analisis.SemesterSisa <= 4 {
			color = "blue"
		}
		qa = append(qa, dto.TanyaJawabResponse{
			Question: "Berapa lama lagi mahasiswa ini bisa lulus?",
			Answer:   answer,
			Color:    color,
		})
	} else if !resp.Lulus {
		qa = append(qa, dto.TanyaJawabResponse{
			Question: "Berapa lama lagi mahasiswa ini bisa lulus?",
			Answer:   "Belum dapat diprediksi karena belum ada data semester yang cukup untuk perhitungan.",
			Color:    "gray",
		})
	}

	// Q: Active/Inactive status with sub-status
	tahunSekarang := time.Now().Year()
	batasKelulusanStatus := resp.Angkatan + 7
	if !resp.Lulus {
		if resp.Status == "Aktif" {
			qa = append(qa, dto.TanyaJawabResponse{
				Question: "Apakah mahasiswa ini aktif mengikuti perkuliahan?",
				Answer:   fmt.Sprintf("Ya, mahasiswa sedang aktif mengambil mata kuliah semester ini. IPK: %.2f, SKS Lulus: %d/%d (%.0f%%).", resp.IPK, resp.SKSLulus, TotalSKSWajib, analisis.ProgressSKS),
				Color:    "green",
			})
		} else if resp.Status == "Tidak Aktif" {
			// Check sub-status
			sisaWaktuStatus := batasKelulusanStatus - tahunSekarang
			var answer string
			var color string

			if sisaWaktuStatus <= 1 {
				// Sudah Mau DO
				if sisaWaktuStatus <= 0 {
					answer = fmt.Sprintf("TIDAK AKTIF - SUDAH MAU DO! Mahasiswa angkatan %d TIDAK mengambil KRS semester ini dan sudah melewati batas waktu studi maksimal (7 tahun). IPK: %.2f, Progress: %.0f%%. KRITIS: Perlu evaluasi status akademik segera!",
						resp.Angkatan, resp.IPK, analisis.ProgressSKS)
				} else {
					answer = fmt.Sprintf("TIDAK AKTIF - SUDAH MAU DO! Mahasiswa angkatan %d TIDAK mengambil KRS semester ini dan hanya tersisa %d tahun sebelum batas DO (tahun %d). IPK: %.2f, Progress: %.0f%%. PERHATIAN: Mahasiswa harus segera mengambil KRS dan menyelesaikan studi!",
						resp.Angkatan, sisaWaktuStatus, batasKelulusanStatus, resp.IPK, analisis.ProgressSKS)
				}
				color = "red"
			} else {
				// Tidak KRS biasa
				answer = fmt.Sprintf("TIDAK AKTIF - Tidak KRS. Mahasiswa angkatan %d tidak mengambil mata kuliah semester ini. IPK: %.2f, SKS Lulus: %d/%d (%.0f%%). Sisa waktu studi: %d tahun (batas: %d). Mahasiswa perlu segera mengambil KRS untuk melanjutkan studi.",
					resp.Angkatan, resp.IPK, resp.SKSLulus, TotalSKSWajib, analisis.ProgressSKS, sisaWaktuStatus, batasKelulusanStatus)
				color = "orange"
			}

			qa = append(qa, dto.TanyaJawabResponse{
				Question: "Apakah mahasiswa ini aktif mengikuti perkuliahan?",
				Answer:   answer,
				Color:    color,
			})
		}
	}

	// Q: SKS per semester type (Ganjil/Genap)
	if analisis.SKSGanjil > 0 || analisis.SKSGenap > 0 {
		totalSKS := analisis.SKSGanjil + analisis.SKSGenap
		var analisisComment string
		if analisis.SKSGanjil > analisis.SKSGenap {
			selisih := analisis.SKSGanjil - analisis.SKSGenap
			analisisComment = fmt.Sprintf("Lebih produktif di semester ganjil (+%d SKS).", selisih)
		} else if analisis.SKSGenap > analisis.SKSGanjil {
			selisih := analisis.SKSGenap - analisis.SKSGanjil
			analisisComment = fmt.Sprintf("Lebih produktif di semester genap (+%d SKS).", selisih)
		} else {
			analisisComment = "Distribusi SKS seimbang antara ganjil dan genap."
		}
		qa = append(qa, dto.TanyaJawabResponse{
			Question: "Berapa SKS yang ditempuh di semester ganjil dan genap?",
			Answer: fmt.Sprintf("Semester Ganjil: %d SKS, Semester Genap: %d SKS. Total: %d SKS. %s",
				analisis.SKSGanjil, analisis.SKSGenap, totalSKS, analisisComment),
			Color: "blue",
		})
	}

	// Q: Average SKS per semester
	qa = append(qa, dto.TanyaJawabResponse{
		Question: "Berapa rata-rata SKS yang ditempuh per semester?",
		Answer: fmt.Sprintf("Rata-rata %.1f SKS per semester selama %d semester aktif. Rata-rata mata kuliah lulus per semester: %.1f MK. Total SKS lulus saat ini: %d dari %d SKS.",
			analisis.SKSPerSemester, analisis.SemesterAktif, analisis.MKLulusPerSem, resp.SKSLulus, TotalSKSWajib),
		Color: "blue",
	})

	// Q: On-track status
	if !resp.Lulus {
		expectedProgressPct := int(math.Round((float64(analisis.SemesterAktif) / float64(SemesterIdeal)) * 100))
		var answer string
		var color string
		if analisis.IsOnTrack {
			answer = fmt.Sprintf("Ya, mahasiswa berada di jalur yang tepat. Sudah menyelesaikan %.0f%% SKS di semester ke-%d (target ~%d%%).",
				analisis.ProgressSKS, analisis.SemesterAktif, expectedProgressPct)
			color = "green"
		} else {
			answer = fmt.Sprintf("Tidak. Baru %.0f%% SKS selesai di semester ke-%d, sementara seharusnya sudah sekitar %d%% pada titik ini.",
				analisis.ProgressSKS, analisis.SemesterAktif, expectedProgressPct)
			color = "orange"
		}
		qa = append(qa, dto.TanyaJawabResponse{
			Question: "Apakah mahasiswa ini on-track untuk lulus tepat waktu (4 tahun)?",
			Answer:   answer,
			Color:    color,
		})
	}

	// Q: HAPS (Hampir Lulus) status with IPK
	if !resp.Lulus && analisis.ProgressSKS >= 85 {
		sksSisa := TotalSKSWajib - resp.SKSLulus
		var answer string
		var color string
		if analisis.ProgressSKS >= 95 {
			answer = fmt.Sprintf("HAMPIR LULUS! Sudah menyelesaikan %.0f%% SKS (%d/%d). Tinggal %d SKS lagi. IPK saat ini: %.2f. ",
				analisis.ProgressSKS, resp.SKSLulus, TotalSKSWajib, sksSisa, resp.IPK)
			if resp.IPK >= 3.5 {
				answer += "Berpotensi lulus dengan predikat cum laude!"
			} else if resp.IPK >= 3.0 {
				answer += "Berpotensi lulus dengan predikat sangat memuaskan."
			} else if resp.IPK >= 2.5 {
				answer += "Berpotensi lulus dengan predikat memuaskan."
			}
			color = "green"
		} else {
			answer = fmt.Sprintf("Mendekati kelulusan dengan %.0f%% SKS selesai (%d/%d). Sisa %d SKS. IPK saat ini: %.2f.",
				analisis.ProgressSKS, resp.SKSLulus, TotalSKSWajib, sksSisa, resp.IPK)
			color = "blue"
		}
		qa = append(qa, dto.TanyaJawabResponse{
			Question: "Bagaimana status kelulusan mahasiswa ini (HAPS)?",
			Answer:   answer,
			Color:    color,
		})
	}

	// Q: SKS needed for on-time graduation
	if !resp.Lulus && analisis.SKSSisa > 0 {
		semesterSisaIdeal := SemesterIdeal - analisis.SemesterAktif
		if semesterSisaIdeal > 0 {
			var comment string
			var color string
			if analisis.SKSPerSemIdeal > 24 {
				comment = "Jumlah ini melebihi batas normal (20-24 SKS), sehingga kelulusan tepat waktu kemungkinan sulit tercapai."
				color = "red"
			} else if analisis.SKSPerSemIdeal > 20 {
				comment = "Beban ini cukup berat namun masih memungkinkan."
				color = "orange"
			} else {
				comment = "Target ini sangat realistis dan bisa dicapai."
				color = "green"
			}
			qa = append(qa, dto.TanyaJawabResponse{
				Question: "Berapa SKS yang harus diambil per semester agar lulus tepat waktu?",
				Answer: fmt.Sprintf("Untuk lulus dalam %d semester (4 tahun), mahasiswa harus mengambil minimal %d SKS per semester selama %d semester ke depan. %s",
					SemesterIdeal, analisis.SKSPerSemIdeal, semesterSisaIdeal, comment),
				Color: color,
			})
		}
	}

	// Q: Dropout risk (DO) with graduation deadline
	// Maximum study duration is 7 years (14 semesters)
	batasKelulusan := resp.Angkatan + 7
	sisaWaktu := batasKelulusan - tahunSekarang

	if !resp.Lulus && (analisis.RiskDO || sisaWaktu <= 1) {
		var answer string
		var color string

		if sisaWaktu <= 0 {
			answer = fmt.Sprintf("PERINGATAN KRITIS! Mahasiswa angkatan %d telah melewati batas waktu studi maksimal (7 tahun, berakhir tahun %d). IPK saat ini: %.2f. Masa studi sudah %d tahun. Status DO perlu dievaluasi segera oleh pihak akademik.",
				resp.Angkatan, batasKelulusan, resp.IPK, analisis.TahunStudi)
			color = "red"
		} else if sisaWaktu == 1 {
			answer = fmt.Sprintf("PERINGATAN! Mahasiswa angkatan %d hanya memiliki waktu tersisa 1 tahun sebelum batas DO (tahun %d). IPK saat ini: %.2f dengan %d SKS tersisa. Progress: %.0f%%. Perlu percepatan penyelesaian studi.",
				resp.Angkatan, batasKelulusan, resp.IPK, analisis.SKSSisa, analisis.ProgressSKS)
			color = "red"
		} else if analisis.RiskDO {
			answer = fmt.Sprintf("Berisiko DO! IPK %.2f (di bawah 2.0) dengan masa studi %d tahun. Batas waktu studi: tahun %d (sisa %d tahun). Progress SKS: %.0f%%. Perlu intervensi segera dari pembimbing akademik.",
				resp.IPK, analisis.TahunStudi, batasKelulusan, sisaWaktu, analisis.ProgressSKS)
			color = "red"
		}

		if answer != "" {
			qa = append(qa, dto.TanyaJawabResponse{
				Question: "Apakah mahasiswa ini berisiko putus studi (DO)?",
				Answer:   answer,
				Color:    color,
			})
		}
	} else if !resp.Lulus && sisaWaktu <= 2 {
		// Warning for students approaching deadline
		qa = append(qa, dto.TanyaJawabResponse{
			Question: "Apakah mahasiswa ini berisiko putus studi (DO)?",
			Answer: fmt.Sprintf("Perlu perhatian! Mahasiswa angkatan %d memiliki sisa waktu %d tahun sebelum batas maksimal studi (tahun %d). IPK: %.2f, Progress: %.0f%%, SKS tersisa: %d. Sebaiknya mempercepat penyelesaian studi.",
				resp.Angkatan, sisaWaktu, batasKelulusan, resp.IPK, analisis.ProgressSKS, analisis.SKSSisa),
			Color: "orange",
		})
	}

	// Q: Cum laude potential
	if analisis.BisaCumLaude && !resp.Lulus {
		qa = append(qa, dto.TanyaJawabResponse{
			Question: "Apakah mahasiswa ini berpotensi lulus cum laude?",
			Answer:   fmt.Sprintf("Ya! IPK %.2f dengan tanpa mata kuliah yang diulang menunjukkan potensi cum laude. Pertahankan performa ini hingga kelulusan.", resp.IPK),
			Color:    "green",
		})
	}

	return qa
}

// formatIndonesianDate formats date in Indonesian locale
func formatIndonesianDate(t time.Time) string {
	months := []string{
		"Januari", "Februari", "Maret", "April", "Mei", "Juni",
		"Juli", "Agustus", "September", "Oktober", "November", "Desember",
	}
	return fmt.Sprintf("%s %d", months[t.Month()-1], t.Year())
}
