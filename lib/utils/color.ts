import { darken, lighten } from "color2k"

function isValidColor(color: string): boolean {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
}

function hexToRgba(hex: string, alpha = 1): string {
  // Remove the hash if it exists
  const cleanHex = hex.replace("#", "")

  // Expand 3-digit hex to 6-digit
  const fullHex =
    cleanHex.length === 3
      ? cleanHex
          .split("")
          .map((c) => c + c)
          .join("")
      : cleanHex

  // Convert to RGB values
  const r = Number.parseInt(fullHex.substr(0, 2), 16)
  const g = Number.parseInt(fullHex.substr(2, 2), 16)
  const b = Number.parseInt(fullHex.substr(4, 2), 16)

  // Return rgba string
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function getLuminance(hexColor: string): number {
  if (!isValidColor(hexColor)) {
    return 0.5 // Default luminance for invalid colors
  }

  // Remove the hash if it exists
  const hex = hexColor.replace("#", "")

  // Expand 3-digit hex to 6-digit
  const fullHex =
    hex.length === 3
      ? hex
          .split("")
          .map((c) => c + c)
          .join("")
      : hex

  // Convert hex to RGB
  const r = Number.parseInt(fullHex.substr(0, 2), 16)
  const g = Number.parseInt(fullHex.substr(2, 2), 16)
  const b = Number.parseInt(fullHex.substr(4, 2), 16)

  // Calculate relative luminance using sRGB
  const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255

  return luminance
}

export function getContrastColor(hexColor: string): string {
  const luminance = getLuminance(hexColor)
  return luminance > 0.5 ? "#000000" : "#FFFFFF"
}

export function generateColorVariations(baseColor: string) {
  const defaultColor = "#0076BE"
  let color = isValidColor(baseColor) ? baseColor : defaultColor

  try {
    return {
      base: color,
      lighter: lighten(color, 0.1),
      darker: darken(color, 0.1),
      darkest: darken(color, 0.2),
      overlay: hexToRgba(color, 0.95),
    }
  } catch (error) {
    // If color manipulation fails, return default colors
    color = defaultColor
    return {
      base: color,
      lighter: "#1A8AD4", // Lightened default color
      darker: "#005C94", // Darkened default color
      darkest: "#004270", // More darkened default color
      overlay: "rgba(0, 118, 190, 0.95)", // Default color with opacity
    }
  }
}

export function generateEventColors(baseColor: string) {
  const colors = generateColorVariations(baseColor)

  return {
    primary: colors.base,
    secondary: colors.darker,
    tertiary: colors.darkest,
    text: getContrastColor(baseColor),
    textMuted: hexToRgba(getContrastColor(baseColor), 0.7),
  }
}

