package config

import "os"

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
func Load() *Config {
	return &Config{
		Port:            getEnv("PORT", "8080"),
		GraphQLEndpoint: getEnv("GRAPHQL_ENDPOINT", "https://sicekcok.if.unismuh.ac.id/graphql"),
		KodeFakultas:    getEnv("KODE_FAKULTAS", "04"),
		AngkatanFrom:    2019,
		AngkatanTo:      2025,
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
