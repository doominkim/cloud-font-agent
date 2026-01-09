/**
 * Font State Management Utilities
 * Handles synchronization between UI state and system state
 * Requirements: 4.2, 4.3, 4.5
 */

import { Font } from "../../types/ui";

/**
 * Synchronize font enabled states with registered fonts from the system
 * Requirement 4.2, 4.3: UI state should match system state
 *
 * @param fonts - Array of fonts from API
 * @param registeredFonts - Array of currently registered fonts from system
 * @returns Updated fonts array with correct enabled states
 */
export function syncFontStates(
  fonts: Font[],
  registeredFonts: Array<{ id: string; name: string; isActive: boolean }>
): Font[] {
  // Create a map of registered font IDs for quick lookup
  const registeredMap = new Map<string, boolean>();

  registeredFonts.forEach((rf) => {
    registeredMap.set(rf.id, rf.isActive);
  });

  // Update enabled state for each font based on registration status
  return fonts.map((font) => ({
    ...font,
    enabled: registeredMap.has(font.id) && registeredMap.get(font.id) === true,
  }));
}

/**
 * Update a single font's enabled state in the fonts array
 *
 * @param fonts - Array of fonts
 * @param fontId - ID of font to update
 * @param enabled - New enabled state
 * @returns Updated fonts array
 */
export function updateFontState(
  fonts: Font[],
  fontId: string,
  enabled: boolean
): Font[] {
  return fonts.map((font) =>
    font.id === fontId ? { ...font, enabled } : font
  );
}

/**
 * Get a font by ID from the fonts array
 *
 * @param fonts - Array of fonts
 * @param fontId - ID of font to find
 * @returns Font object or undefined if not found
 */
export function getFontById(fonts: Font[], fontId: string): Font | undefined {
  return fonts.find((font) => font.id === fontId);
}

/**
 * Check if a font is registered in the system
 *
 * @param fontId - ID of font to check
 * @param registeredFonts - Array of registered fonts
 * @returns True if font is registered, false otherwise
 */
export function isFontRegistered(
  fontId: string,
  registeredFonts: Array<{ id: string; name: string; isActive: boolean }>
): boolean {
  const registered = registeredFonts.find((rf) => rf.id === fontId);
  return registered !== undefined && registered.isActive;
}
