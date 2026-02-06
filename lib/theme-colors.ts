import React from "react"
// Theme colors based on student gender
export const themeColors = {
  girl: {
    primary: '#ec4899', // Pink
    secondary: '#a855f7', // Purple
    accent: '#f472b6', // Light pink
    background: '#fdf2f8', // Very light pink
    success: '#d946ef', // Bright purple
  },
  boy: {
    primary: '#0ea5e9', // Blue
    secondary: '#10b981', // Green
    accent: '#fbbf24', // Yellow
    background: '#f0f9ff', // Very light blue
    success: '#06b6d4', // Cyan
  },
}

export type Gender = 'girl' | 'boy'

export function getThemeByGender(gender?: string): typeof themeColors.girl {
  if (gender === 'girl') return themeColors.girl
  return themeColors.boy
}

export function getThemeCSSVariables(gender?: string) {
  const theme = getThemeByGender(gender)
  return {
    '--primary': theme.primary,
    '--secondary': theme.secondary,
    '--accent': theme.accent,
    '--background': theme.background,
    '--success': theme.success,
  } as React.CSSProperties
}
