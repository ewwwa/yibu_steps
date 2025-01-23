export function getLuminance(hexColor: string): number {
  // Remove the hash if it exists
  const hex = hexColor.replace("#", "")

  // Convert hex to RGB
  const r = Number.parseInt(hex.substr(0, 2), 16) / 255
  const g = Number.parseInt(hex.substr(2, 2), 16) / 255
  const b = Number.parseInt(hex.substr(4, 2), 16) / 255

  // Calculate relative luminance using sRGB
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b

  return luminance
}

export function getContrastColor(hexColor: string): string {
  const luminance = getLuminance(hexColor)
  return luminance > 0.5 ? "#000000" : "#FFFFFF"
}

