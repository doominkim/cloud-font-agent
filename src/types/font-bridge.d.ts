// Type definitions for native font bridge module

export interface UnregisterAllResult {
  success: number;
  failed: number;
}

export interface FontBridge {
  /**
   * Register a font file with the system (process scope)
   * @param filePath - Absolute path to the font file
   * @returns true if registration succeeded
   * @throws Error if registration fails
   */
  registerFont(filePath: string): boolean;

  /**
   * Unregister a font file from the system
   * @param filePath - Absolute path to the font file
   * @returns true if unregistration succeeded
   * @throws Error if unregistration fails
   */
  unregisterFont(filePath: string): boolean;

  /**
   * Unregister all fonts that were registered by this application
   * @returns Object with success and failed counts
   */
  unregisterAllFonts(): UnregisterAllResult;
}

declare const fontBridge: FontBridge;
export default fontBridge;
