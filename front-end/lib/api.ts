// Centralized API Base URL configuration
// Reads from environment variable, falls back to localhost for development
export const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api/v1';
