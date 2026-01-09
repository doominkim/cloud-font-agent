/**
 * Font API Client for Cloud Font Agent
 * Supports both local font directory and remote API
 */

import * as fs from "fs";
import * as path from "path";
import { app } from "electron";

export interface PurchasedFont {
  id: string;
  name: string;
  downloadUrl: string;
  fileSize: number;
  provider?: string; // Provider/vendor name
  displayName?: string; // Display name for provider
  previewFont?: string; // Font to use for provider preview
}

/**
 * Provider metadata from info.json
 */
interface ProviderInfo {
  provider: string;
  displayName: string;
  description?: string;
  previewFont?: string;
  website?: string;
  fonts: Array<{
    name: string;
    weight?: string;
    style?: string;
    files: Array<{
      file: string;
      format: "truetype" | "opentype";
    }>;
  }>;
}

/**
 * Font source configuration
 * Allows switching between local and remote font sources
 */
interface FontSourceConfig {
  mode: "local" | "remote";
  localFontDirectory?: string;
  remoteApiUrl?: string;
}

/**
 * Font API Client
 * Manages font discovery from local directory or remote API
 */
export class FontAPIClient {
  private config: FontSourceConfig;
  private fontSourceDirectory: string;

  constructor(config?: Partial<FontSourceConfig>) {
    // Default configuration: use local fonts in development
    this.config = {
      mode: process.env.FONT_SOURCE_MODE === "remote" ? "remote" : "local",
      localFontDirectory:
        process.env.LOCAL_FONT_DIRECTORY || this.getDefaultFontDirectory(),
      remoteApiUrl: process.env.REMOTE_API_URL || "https://api.example.com",
      ...config,
    };

    this.fontSourceDirectory = this.config.localFontDirectory!;
    console.log(`Font source mode: ${this.config.mode}`);
    console.log(`Font directory: ${this.fontSourceDirectory}`);
  }

  /**
   * Get default font directory based on environment
   * Development: ./fonts in project root
   * Production: Hidden system directory
   */
  private getDefaultFontDirectory(): string {
    const isDevelopment = !app.isPackaged;

    if (isDevelopment) {
      // Development: use fonts folder in project root
      return path.join(process.cwd(), "fonts");
    } else {
      // Production: use hidden system directory
      // This can be customized based on deployment strategy
      return path.join(
        app.getPath("userData"),
        ".system",
        ".fonts",
        ".library"
      );
    }
  }

  /**
   * Fetches the list of purchased fonts
   * Supports both local directory scanning and remote API
   *
   * @returns Promise resolving to array of purchased fonts
   */
  async fetchPurchasedFonts(): Promise<PurchasedFont[]> {
    if (this.config.mode === "local") {
      return this.fetchLocalFonts();
    } else {
      return this.fetchRemoteFonts();
    }
  }

  /**
   * Scan local font directory and return font list
   * Supports nested directory structure: fonts/[provider]/[font-files]
   */
  private async fetchLocalFonts(): Promise<PurchasedFont[]> {
    try {
      // Ensure font directory exists
      await fs.promises.mkdir(this.fontSourceDirectory, { recursive: true });

      // Read all entries in font directory
      const entries = await fs.promises.readdir(this.fontSourceDirectory, {
        withFileTypes: true,
      });

      const fonts: PurchasedFont[] = [];

      // Process each entry (could be file or directory)
      for (const entry of entries) {
        if (entry.isDirectory()) {
          // Provider directory (e.g., "피플퍼스트", "Boritype")
          const providerName = entry.name;
          const providerPath = path.join(
            this.fontSourceDirectory,
            providerName
          );

          // Read font files in provider directory
          const providerFonts = await this.scanProviderDirectory(
            providerPath,
            providerName
          );
          fonts.push(...providerFonts);
        } else if (entry.isFile()) {
          // Direct font file in root fonts directory
          const ext = path.extname(entry.name).toLowerCase();
          if (ext === ".ttf" || ext === ".otf") {
            const fontInfo = await this.createFontInfo(
              path.join(this.fontSourceDirectory, entry.name),
              entry.name,
              "Unknown" // No provider for root-level fonts
            );
            fonts.push(fontInfo);
          }
        }
      }

      console.log(
        `Found ${fonts.length} font files across ${
          entries.filter((e) => e.isDirectory()).length
        } providers`
      );

      return fonts;
    } catch (error) {
      console.error("Failed to fetch local fonts:", error);
      return [];
    }
  }

  /**
   * Scan a provider directory for font files
   * Reads info.json if available for metadata
   */
  private async scanProviderDirectory(
    providerPath: string,
    providerName: string
  ): Promise<PurchasedFont[]> {
    try {
      // Try to read info.json for metadata
      const infoPath = path.join(providerPath, "info.json");
      let providerInfo: ProviderInfo | null = null;

      try {
        const infoContent = await fs.promises.readFile(infoPath, "utf-8");
        providerInfo = JSON.parse(infoContent);
        console.log(`  ${providerName}: Loaded metadata from info.json`);
      } catch (error) {
        console.log(`  ${providerName}: No info.json found, using defaults`);
      }

      const files = await fs.promises.readdir(providerPath);
      const fonts: PurchasedFont[] = [];

      // If we have provider info with new structure, use it
      if (providerInfo && providerInfo.fonts) {
        for (const fontMeta of providerInfo.fonts) {
          // Process each file format for this font
          for (const fileInfo of fontMeta.files) {
            const filePath = path.join(providerPath, fileInfo.file);

            // Check if file exists
            try {
              await fs.promises.access(filePath);
            } catch {
              console.warn(
                `  ${providerName}: File not found: ${fileInfo.file}`
              );
              continue;
            }

            const fontInfo = await this.createFontInfo(
              filePath,
              fileInfo.file,
              providerName,
              providerInfo,
              fontMeta,
              fileInfo.format
            );

            fonts.push(fontInfo);
          }
        }
      } else {
        // Fallback: scan directory for font files
        for (const file of files) {
          const ext = path.extname(file).toLowerCase();

          // Skip non-font files
          if (ext !== ".ttf" && ext !== ".otf") {
            continue;
          }

          const filePath = path.join(providerPath, file);
          const fontInfo = await this.createFontInfo(
            filePath,
            file,
            providerName,
            providerInfo
          );

          fonts.push(fontInfo);
        }
      }

      console.log(`  ${providerName}: ${fonts.length} fonts`);
      return fonts;
    } catch (error) {
      console.error(
        `Failed to scan provider directory ${providerName}:`,
        error
      );
      return [];
    }
  }

  /**
   * Create font info object from file
   */
  private async createFontInfo(
    filePath: string,
    filename: string,
    providerName: string,
    providerInfo: ProviderInfo | null = null,
    fontMeta?: { name: string; weight?: string; style?: string },
    format?: "truetype" | "opentype"
  ): Promise<PurchasedFont> {
    const stats = await fs.promises.stat(filePath);

    // Generate font ID from provider and filename
    const fontId = `${providerName}-${path.basename(
      filename,
      path.extname(filename)
    )}`;

    // Use metadata name if available, otherwise extract from filename
    const fontName = fontMeta?.name || this.extractFontName(filename);

    // Get display name and preview font from provider info
    const displayName = providerInfo?.displayName || providerName;
    const previewFont = providerInfo?.previewFont;

    return {
      id: fontId,
      name: fontName,
      downloadUrl: `file://${filePath}`,
      fileSize: stats.size,
      provider: providerName,
      displayName: displayName,
      previewFont: previewFont,
    };
  }

  /**
   * Extract readable font name from filename
   * Examples:
   *   "Roboto-Regular.ttf" -> "Roboto Regular"
   *   "OpenSans_Bold.otf" -> "OpenSans Bold"
   *   "NotoSansKR-Medium.ttf" -> "NotoSansKR Medium"
   */
  private extractFontName(filename: string): string {
    // Remove extension
    const nameWithoutExt = path.basename(filename, path.extname(filename));

    // Replace hyphens and underscores with spaces
    const nameWithSpaces = nameWithoutExt.replace(/[-_]/g, " ");

    return nameWithSpaces;
  }

  /**
   * Fetch fonts from remote API
   * Placeholder for future implementation
   */
  private async fetchRemoteFonts(): Promise<PurchasedFont[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    console.log(`Fetching fonts from remote API: ${this.config.remoteApiUrl}`);

    // TODO: Implement actual API call
    // const response = await fetch(`${this.config.remoteApiUrl}/fonts`);
    // return response.json();

    // For now, return empty array
    console.warn("Remote API not implemented yet");
    return [];
  }

  /**
   * Get current font source configuration
   */
  getConfig(): FontSourceConfig {
    return { ...this.config };
  }

  /**
   * Update font source configuration
   */
  updateConfig(config: Partial<FontSourceConfig>): void {
    this.config = { ...this.config, ...config };

    if (config.localFontDirectory) {
      this.fontSourceDirectory = config.localFontDirectory;
    }

    console.log(`Font source configuration updated:`, this.config);
  }
}
