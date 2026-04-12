package config

import (
	"os"
	"time"
)

// Config holds application configuration
type Config struct {
	Port            string
	GraphQLEndpoint string
	KodeFakultas    string
	AngkatanFrom    int
	AngkatanTo      int
	RedisAddr       string
	RedisPassword   string
	RedisDB         int
	CacheTTL        int // in minutes
}

// Load returns application configuration
// Angkatan is calculated dynamically: last 7 years from current year
// e.g., in 2026 -> 2020-2026, in 2027 -> 2021-2027
func Load() *Config {
	currentYear := time.Now().Year()
	angkatanTo := currentYear
	angkatanFrom := currentYear - 6 // 7 tahun terakhir (termasuk tahun sekarang)

	return &Config{
		Port:            getEnv("PORT", "8080"),
		GraphQLEndpoint: getEnv("GRAPHQL_ENDPOINT", "https://sicekcok.if.unismuh.ac.id/graphql"),
		KodeFakultas:    getEnv("KODE_FAKULTAS", "04"),
		AngkatanFrom:    angkatanFrom,
		AngkatanTo:      angkatanTo,
		RedisAddr:       getEnv("REDIS_ADDR", "localhost:6379"),
		RedisPassword:   getEnv("REDIS_PASSWORD", ""),
		RedisDB:         0,
		CacheTTL:        30, // 30 minutes - student data changes infrequently
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
