/**
 * FontManager - Manages font registration and lifecycle
 * Requirements: 3.1, 3.2, 3.3, 3.4, 4.1, 4.2, 4.3, 7.1, 7.2, 7.3
 */

import * as fs from "fs";
import * as path from "path";
import * as os from "os";
import { promisify } from "util";
import { FontSecurity } from "./font-security";

const mkdir = promisify(fs.mkdir);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);
const stat = promisify(fs.stat);
const chmod = promisify(fs.chmod);

// Import native module
let fontBridge: any;
try {
  fontBridge = require("../../build/Release/font_bridge.node");
} catch (error) {
  console.error("Failed to load native font bridge module:", error);
  throw new Error("Native font bridge module not available");
}

/**
 * Represents a registered font in the system
 */
export interface RegisteredFont {
  id: string;
  name: string;
  filePath: string;
  registeredAt: Date;
  isActive: boolean;
}

/**
 * FontManager handles font registration, tracking, and cleanup
 * Requirement 7.1: Font Cache Directory in user data directory
 * Requirement 7.2: Does not modify system font directories
 */
export class FontManager {
  private registeredFonts: Map<string, RegisteredFont>;
  private cacheDirectory: string;
  private fontSecurity: FontSecurity;

  constructor() {
    this.registeredFonts = new Map();
    // Requirement 7.1: Create cache directory in user data directory
    this.cacheDirectory = path.join(os.homedir(), ".cloud-font-agent");

    // Initialize enhanced security
    this.fontSecurity = new FontSecurity(this.cacheDirectory, {
      enableFileWatcher: true,
      enableObfuscation: true,
      enablePermissionHardening: true,
      watcherSensitivity: 2000, // 2 seconds
    });
  }

  /**
   * Initialize the FontManager
   * Creates the cache directory if it doesn't exist
   * Cleans up any leftover files from previous sessions
   * Requirement 4.5: Clean up cache directory on next run if previous cleanup failed
   */
  async initialize(): Promise<void> {
    try {
      // Initialize secure directory structure
      await this.fontSecurity.initializeSecureDirectory();

      // Clean up any leftover files from previous sessions
      // Requirement 4.5: Clean up on next run if previous cleanup failed
      await this.fontSecurity.cleanup();

      console.log("FontManager initialized with enhanced security");
    } catch (error) {
      console.error("Failed to initialize FontManager:", error);
      throw error;
    }
  }

  /**
   * Register a font file with the system
   * Requirement 3.1: Fonts are immediately available in all macOS applications
   * Requirement 3.2: Fonts remain active while app is running
   * Requirement 7.3: Use user-level registration (no admin privileges required)
   *
   * @param filePath - Absolute path to the font file
   * @param fontName - Name of the font
   * @param fontId - Unique identifier for the font (optional, will be generated from filePath if not provided)
   * @returns RegisteredFont object with registration details
   * @throws Error if registration fails
   */
  async registerFont(
    filePath: string,
    fontName: string,
    fontId?: string
  ): Promise<RegisteredFont> {
    try {
      // Verify file exists
      await stat(filePath);

      // Set read-only permissions on font file
      // Requirement 7.5: Read-only permissions on downloaded fonts
      await chmod(filePath, 0o400);

      // Call native module to register font
      // Requirement 3.1: Register font using CTFontManager
      const success = fontBridge.registerFont(filePath);

      if (!success) {
        // Requirement 3.4: Delete file if registration fails
        await this.deleteFontFile(filePath);
        throw new Error(`Failed to register font: ${fontName}`);
      }

      // Use provided fontId or generate from filename (including extension)
      const id = fontId || path.basename(filePath);

      // Create registered font record
      const registeredFont: RegisteredFont = {
        id: id,
        name: fontName,
        filePath: filePath,
        registeredAt: new Date(),
        isActive: true,
      };

      // Track in memory
      // Requirement 3.3: Track font registration state
      this.registeredFonts.set(registeredFont.id, registeredFont);

      console.log(`Font registered successfully: ${fontName} at ${filePath}`);
      return registeredFont;
    } catch (error) {
      console.error(`Failed to register font ${fontName}:`, error);
      // Requirement 3.4: Delete file if registration fails
      await this.deleteFontFile(filePath);
      throw error;
    }
  }

  /**
   * Get list of all registered fonts
   * Requirement 3.3: Display font synchronization status
   *
   * @returns Array of registered fonts
   */
  getRegisteredFonts(): RegisteredFont[] {
    return Array.from(this.registeredFonts.values());
  }

  /**
   * Get the font cache directory path
   *
   * @returns Absolute path to cache directory
   */
  getCacheDirectory(): string {
    return this.fontSecurity.getSecurityStatus().secureDirectory;
  }

  /**
   * Get secure file path for font storage
   *
   * @param fontId - Font identifier
   * @param extension - File extension
   * @returns Secure file path with obfuscated filename
   */
  getSecureFilePath(fontId: string, extension: string): string {
    return this.fontSecurity.getSecureFilePath(fontId, extension);
  }

  /**
   * Unregister a font from the system
   * Requirement 4.1: Unregister fonts when toggled off
   * Requirement 4.2: Delete font file after unregistration
   *
   * @param fontId - ID of the font to unregister
   * @returns Promise that resolves when unregistration is complete
   * @throws Error if font is not found or unregistration fails
   */
  async unregisterFont(fontId: string): Promise<void> {
    try {
      // Find the registered font
      const registeredFont = this.registeredFonts.get(fontId);
      if (!registeredFont) {
        throw new Error(`Font not found: ${fontId}`);
      }

      console.log(`Unregistering font: ${registeredFont.name}`);

      // Call native module to unregister font
      const success = fontBridge.unregisterFont(registeredFont.filePath);

      if (!success) {
        throw new Error(`Failed to unregister font: ${registeredFont.name}`);
      }

      // Remove from tracking
      this.registeredFonts.delete(fontId);

      // Delete the font file
      // Requirement 4.2: Delete font file after unregistration
      await this.deleteFontFile(registeredFont.filePath);

      console.log(`Font unregistered successfully: ${registeredFont.name}`);
    } catch (error) {
      console.error(`Failed to unregister font ${fontId}:`, error);
      throw error;
    }
  }

  /**
   * Check if a font is currently registered
   *
   * @param fontId - ID of the font to check
   * @returns True if font is registered, false otherwise
   */
  isFontRegistered(fontId: string): boolean {
    return this.registeredFonts.has(fontId);
  }

  /**
   * Force cleanup of cache directory
   * Useful for manual cleanup or debugging
   *
   * @returns Promise that resolves when cleanup is complete
   */
  async forceCleanupCache(): Promise<void> {
    console.log("Force cleaning cache directory...");
    await this.cleanupCacheDirectory();
  }

  /**
   * Clean up all registered fonts and cache files
   * Called when application is shutting down
   * Requirement 4.1: Unregister all fonts on app quit
   * Requirement 4.2: Delete all font files after unregistration
   * Requirement 4.3: Cache directory should be empty after cleanup
   */
  async cleanup(): Promise<void> {
    console.log("Starting FontManager cleanup...");

    try {
      // Requirement 4.1: Unregister all fonts using native module
      const result = fontBridge.unregisterAllFonts();
      console.log(
        `Unregistered fonts - Success: ${result.success}, Failed: ${result.failed}`
      );

      // Clear in-memory tracking
      this.registeredFonts.clear();

      // Requirement 4.2: Secure cleanup of all font files
      await this.fontSecurity.cleanup();

      console.log("FontManager cleanup completed with enhanced security");
    } catch (error) {
      console.error("Error during FontManager cleanup:", error);
      // Don't throw - we want cleanup to complete as much as possible
    }
  }

  /**
   * Delete all files in the cache directory
   * Requirement 4.2: Delete all font files
   * Requirement 4.3: Cache directory should be empty
   *
   * @private
   */
  private async cleanupCacheDirectory(): Promise<void> {
    try {
      const files = await readdir(this.cacheDirectory);

      for (const file of files) {
        const filePath = path.join(this.cacheDirectory, file);
        try {
          const stats = await stat(filePath);
          if (stats.isFile()) {
            // Change permissions to writable before deletion
            // Font files are set to read-only (0400) during registration
            await chmod(filePath, 0o600);
            await unlink(filePath);
            console.log(`Deleted font file: ${filePath}`);
          }
        } catch (error) {
          console.error(`Failed to delete file ${filePath}:`, error);
          // Continue with other files even if one fails
        }
      }

      console.log("Cache directory cleaned");
    } catch (error) {
      console.error("Failed to clean cache directory:", error);
      // Don't throw - directory might not exist yet
    }
  }

  /**
   * Delete a single font file
   * Used when registration fails
   *
   * @param filePath - Path to font file to delete
   * @private
   */
  private async deleteFontFile(filePath: string): Promise<void> {
    try {
      // Change permissions to writable before deletion
      // Font files might be set to read-only (0400)
      try {
        await chmod(filePath, 0o600);
      } catch (chmodError) {
        // File might not exist or already writable, continue with deletion
      }

      await unlink(filePath);
      console.log(`Deleted font file: ${filePath}`);
    } catch (error) {
      console.error(`Failed to delete font file ${filePath}:`, error);
      // Don't throw - file might not exist
    }
  }
}
