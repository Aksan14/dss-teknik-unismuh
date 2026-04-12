// Utility to calculate last 7 years dynamically
// This ensures data only shows 7 years from current year
// e.g., in 2026: [2020, 2021, 2022, 2023, 2024, 2025, 2026]
// e.g., in 2027: [2021, 2022, 2023, 2024, 2025, 2026, 2027]

export function getLast7Years(): number[] {
  const currentYear = new Date().getFullYear();
  const years: number[] = [];
  
  // 7 tahun terakhir termasuk tahun sekarang
  for (let i = 6; i >= 0; i--) {
    years.push(currentYear - i);
  }
  
  return years;
}

export function getYearRange(): { from: number; to: number } {
  const currentYear = new Date().getFullYear();
  return {
    from: currentYear - 6,
    to: currentYear
  };
}

// Default export as array of years
export const ANGKATAN_YEARS = getLast7Years();
