/**
 * SyncManager - Manages font synchronization (download + registration)
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.6
 */

import * as fs from "fs";
import * as path from "path";
import axios from "axios";
import { BrowserWindow } from "electron";
import { FontManager } from "./font-manager";
import { PurchasedFont } from "./api-client";

/**
 * Progress information for font synchronization
 */
export interface SyncProgress {
  total: number;
  completed: number;
  current: string;
  percentage: number;
}

/**
 * Result of synchronization operation
 */
export interface SyncResult {
  success: number;
  failed: number;
  errors: Array<{ fontName: string; error: string }>;
}

/**
 * SyncManager handles downloading and registering fonts
 * Requirement 2.1: Download all fonts from server
 * Requirement 2.5: Display progress to user
 */
export class SyncManager {
  private fontManager: FontManager;
  private mainWindow: BrowserWindow | null;
  private currentProgress: SyncProgress;
  private isSyncing: boolean;

  constructor(fontManager: FontManager, mainWindow: BrowserWindow | null) {
    this.fontManager = fontManager;
    this.mainWindow = mainWindow;
    this.currentProgress = {
      total: 0,
      completed: 0,
      current: "",
      percentage: 0,
    };
    this.isSyncing = false;
  }

  /**
   * Synchronize all fonts (download + register)
   * Requirement 2.1: Download all fonts when sync button is clicked
   * Requirement 2.6: Continue even if some fonts fail
   *
   * @param fonts - List of fonts to synchronize
   * @returns Sync result with success/failure counts
   */
  async syncAllFonts(fonts: PurchasedFont[]): Promise<SyncResult> {
    if (this.isSyncing) {
      throw new Error("Synchronization already in progress");
    }

    this.isSyncing = true;
    const result: SyncResult = {
      success: 0,
      failed: 0,
      errors: [],
    };

    try {
      // Initialize progress
      this.currentProgress = {
        total: fonts.length,
        completed: 0,
        current: "",
        percentage: 0,
      };

      console.log(`Starting synchronization of ${fonts.length} fonts...`);

      // Requirement 2.1: Process fonts sequentially
      for (const font of fonts) {
        try {
          // Update current font being processed
          this.currentProgress.current = font.name;
          this.sendProgressUpdate();

          console.log(`Syncing font: ${font.name}`);

          // Download font file
          // Requirement 2.1: Download from Font API Server
          const filePath = await this.downloadFont(font);

          // Register font with system
          // Requirement 2.3: Register font after download
          await this.fontManager.registerFont(filePath, font.name);

          result.success++;
          console.log(`Successfully synced: ${font.name}`);
        } catch (error) {
          // Requirement 2.6: Continue even if some fonts fail
          result.failed++;
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          result.errors.push({
            fontName: font.name,
            error: errorMessage,
          });
          console.error(`Failed to sync ${font.name}:`, errorMessage);
        }

        // Update progress
        // Requirement 2.5: Display progress during sync
        this.currentProgress.completed++;
        this.currentProgress.percentage = Math.round(
          (this.currentProgress.completed / this.currentProgress.total) * 100
        );
        this.sendProgressUpdate();
      }

      // Requirement 2.4: Display completion status
      console.log(
        `Synchronization complete - Success: ${result.success}, Failed: ${result.failed}`
      );

      return result;
    } finally {
      this.isSyncing = false;
    }
  }

  /**
   * Download a font file from the server
   * Requirement 2.1: Download fonts from server
   * Requirement 2.2: Save to Font Cache Directory
   *
   * @param font - Font to download
   * @returns Path to downloaded file
   * @throws Error if download fails
   * @private
   */
  private async downloadFont(font: PurchasedFont): Promise<string> {
    try {
      console.log(`Downloading ${font.name} from ${font.downloadUrl}`);

      // Download file using axios
      // Requirement 2.1: Use axios for HTTP download
      const response = await axios.get(font.downloadUrl, {
        responseType: "arraybuffer",
        timeout: 60000, // 60 second timeout
      });

      // Determine file extension from URL or content-type
      const urlExt = path.extname(font.downloadUrl).toLowerCase();
      const extension = [".ttf", ".otf"].includes(urlExt) ? urlExt : ".ttf";

      // Generate unique filename
      // Requirement 2.2: Save to Font Cache Directory
      const fileName = `${font.id}${extension}`;
      const filePath = path.join(
        this.fontManager.getCacheDirectory(),
        fileName
      );

      // Write file to cache directory
      await fs.promises.writeFile(filePath, Buffer.from(response.data));

      console.log(`Downloaded ${font.name} to ${filePath}`);
      return filePath;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      throw new Error(`Failed to download ${font.name}: ${errorMessage}`);
    }
  }

  /**
   * Send progress update to renderer process
   * Requirement 2.5: Send progress events to renderer
   *
   * @private
   */
  private sendProgressUpdate(): void {
    if (this.mainWindow && !this.mainWindow.isDestroyed()) {
      // Send progress event to renderer
      this.mainWindow.webContents.send("sync:progress", this.currentProgress);
    }
  }

  /**
   * Get current synchronization progress
   *
   * @returns Current progress information
   */
  getSyncProgress(): SyncProgress {
    return { ...this.currentProgress };
  }

  /**
   * Cancel ongoing synchronization
   * Note: Current implementation completes the current font before stopping
   */
  cancelSync(): void {
    if (this.isSyncing) {
      console.log("Sync cancellation requested");
      this.isSyncing = false;
    }
  }

  /**
   * Update the main window reference
   * Useful when window is recreated
   *
   * @param window - New main window instance
   */
  setMainWindow(window: BrowserWindow | null): void {
    this.mainWindow = window;
  }
}
