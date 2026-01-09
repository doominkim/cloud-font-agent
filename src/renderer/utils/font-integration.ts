/**
 * Font Integration Utilities
 * Helper functions for integrating font management with the UI
 * Requirements: 4.2, 4.3, 4.5
 */

import { Font } from "../../types/ui";
import { syncFontStates } from "./font-state";

/**
 * Load and synchronize fonts with system state
 * This function fetches fonts from the API and synchronizes their enabled
 * states with the currently registered fonts in the system.
 *
 * Requirements: 4.2, 4.3 - UI state should match system state
 *
 * @returns Promise resolving to synchronized font array
 */
export async function loadSynchronizedFonts(): Promise<Font[]> {
  try {
    // Fetch purchased fonts from API
    const purchasedFonts = await window.fontAPI.fetchFonts();

    // Get currently registered fonts from system
    const registeredFonts = await window.fontAPI.getRegisteredFonts();

    // Convert purchased fonts to UI Font format
    const fonts: Font[] = purchasedFonts.map((pf) => ({
      id: pf.id,
      name: pf.name,
      version: "1.0.0", // Default version if not provided
      providerId: extractProviderId(pf.name),
      providerNameKo: extractProviderNameKo(pf.name),
      providerNameEn: extractProviderNameEn(pf.name),
      enabled: false, // Will be updated by syncFontStates
      downloadUrl: pf.downloadUrl,
      license: "Commercial", // Default license
      fileSize: pf.fileSize,
    }));

    // Synchronize enabled states with registered fonts
    const synchronizedFonts = syncFontStates(fonts, registeredFonts);

    return synchronizedFonts;
  } catch (error) {
    console.error("Failed to load synchronized fonts:", error);
    throw error;
  }
}

/**
 * Extract provider ID from font name
 * This is a simple implementation that uses the first word of the font name
 *
 * @param fontName - Font name
 * @returns Provider ID
 */
function extractProviderId(fontName: string): string {
  // Simple heuristic: use first word as provider ID
  const firstWord = fontName.split(" ")[0].toLowerCase();
  return firstWord;
}

/**
 * Extract Korean provider name from font name
 * This is a placeholder implementation
 *
 * @param fontName - Font name
 * @returns Korean provider name
 */
function extractProviderNameKo(fontName: string): string {
  // Map common provider names
  const providerMap: Record<string, string> = {
    taengtype: "탱타입",
    eighttype: "eighttype",
    fontlibrary: "활자도서관",
  };

  const providerId = extractProviderId(fontName);
  return providerMap[providerId] || providerId;
}

/**
 * Extract English provider name from font name
 * This is a placeholder implementation
 *
 * @param fontName - Font name
 * @returns English provider name
 */
function extractProviderNameEn(fontName: string): string {
  // Map common provider names
  const providerMap: Record<string, string> = {
    taengtype: "Taengtype",
    eighttype: "eighttype",
    fontlibrary: "Font Library",
  };

  const providerId = extractProviderId(fontName);
  return providerMap[providerId] || providerId;
}

/**
 * Handle font toggle with proper error handling and state synchronization
 * This is a wrapper function that can be used by components to handle font toggles
 *
 * Requirements: 4.2, 4.3, 4.5 - Error handling and state rollback
 *
 * @param fontId - ID of font to toggle
 * @param enabled - New enabled state
 * @param font - Font object
 * @param onSuccess - Callback to execute on success
 * @param onError - Callback to execute on error
 */
export async function handleFontToggle(
  fontId: string,
  enabled: boolean,
  font: Font,
  onSuccess?: (enabled: boolean) => void,
  onError?: (error: string) => void
): Promise<void> {
  try {
    if (enabled) {
      // Register font
      const result = await window.fontAPI.registerFont(
        fontId,
        font.downloadUrl,
        font.name
      );

      if (!result.success) {
        throw new Error(result.error || "Registration failed");
      }

      // Call success callback
      if (onSuccess) {
        onSuccess(true);
      }
    } else {
      // Unregister font
      const result = await window.fontAPI.unregisterFont(fontId);

      if (!result.success) {
        throw new Error(result.error || "Unregistration failed");
      }

      // Call success callback
      if (onSuccess) {
        onSuccess(false);
      }
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`Font toggle error for ${fontId}:`, errorMessage);

    // Call error callback
    if (onError) {
      onError(errorMessage);
    }

    // Re-throw to allow caller to handle
    throw error;
  }
}
