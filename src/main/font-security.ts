/**
 * FontSecurity - Enhanced security measures for font protection
 * Provides reasonable protection against casual copying while acknowledging
 * that determined users with admin privileges can bypass these measures
 */

import * as fs from "fs";
import * as path from "path";
import * as crypto from "crypto";
import { promisify } from "util";

const chmod = promisify(fs.chmod);
const unlink = promisify(fs.unlink);
const readdir = promisify(fs.readdir);

export interface SecurityConfig {
  enableFileWatcher: boolean;
  enableObfuscation: boolean;
  enablePermissionHardening: boolean;
  watcherSensitivity: number; // milliseconds
}

/**
 * Enhanced security manager for font files
 * Combines multiple layers of protection:
 * 1. Deep hidden directory structure
 * 2. File access monitoring
 * 3. Obfuscated filenames
 * 4. Strict permissions
 */
export class FontSecurity {
  private watchers: Map<string, fs.FSWatcher>;
  private config: SecurityConfig;
  private secureDirectory: string;
  private isWatching: boolean;

  constructor(baseDirectory: string, config: Partial<SecurityConfig> = {}) {
    this.watchers = new Map();
    this.isWatching = false;

    // Default security configuration
    this.config = {
      enableFileWatcher: true,
      enableObfuscation: true,
      enablePermissionHardening: true,
      watcherSensitivity: 1000,
      ...config,
    };

    // Create deeply nested hidden directory
    // Makes casual discovery much harder
    this.secureDirectory = path.join(
      baseDirectory,
      ".system",
      ".cache",
      ".tmp",
      ".fonts"
    );
  }

  /**
   * Initialize secure directory with enhanced protection
   */
  async initializeSecureDirectory(): Promise<void> {
    try {
      // Create nested hidden directory structure
      await fs.promises.mkdir(this.secureDirectory, {
        recursive: true,
        mode: 0o700,
      });

      // Apply strict permissions to each level
      if (this.config.enablePermissionHardening) {
        await this.hardenDirectoryPermissions();
      }

      // Start file system monitoring
      if (this.config.enableFileWatcher) {
        await this.startFileWatcher();
      }

      console.log(`Secure font directory initialized: ${this.secureDirectory}`);
    } catch (error) {
      console.error("Failed to initialize secure directory:", error);
      throw error;
    }
  }

  /**
   * Generate obfuscated filename for font
   */
  generateSecureFilename(fontId: string, extension: string): string {
    if (!this.config.enableObfuscation) {
      return `${fontId}${extension}`;
    }

    // Create hash-based filename that changes each session
    const sessionSalt = process.pid.toString() + Date.now().toString();
    const hash = crypto
      .createHash("sha256")
      .update(fontId + sessionSalt)
      .digest("hex")
      .substring(0, 16);

    // Use generic extension to avoid detection
    return `${hash}.tmp`;
  }

  /**
   * Get secure file path for font
   */
  getSecureFilePath(fontId: string, extension: string): string {
    const filename = this.generateSecureFilename(fontId, extension);
    return path.join(this.secureDirectory, filename);
  }

  /**
   * Apply strict permissions to directory hierarchy
   */
  private async hardenDirectoryPermissions(): Promise<void> {
    const pathParts = this.secureDirectory.split(path.sep);
    let currentPath = "";

    for (const part of pathParts) {
      if (!part) continue;

      currentPath = path.join(currentPath, part);

      try {
        // Set restrictive permissions (owner only, no group/other access)
        await chmod(currentPath, 0o700);
      } catch (error) {
        // Continue if permission setting fails (might not own parent dirs)
        console.warn(`Could not set permissions on ${currentPath}:`, error);
      }
    }
  }

  /**
   * Start file system watcher for security monitoring
   */
  private async startFileWatcher(): Promise<void> {
    if (this.isWatching) return;

    try {
      const watcher = fs.watch(
        this.secureDirectory,
        { recursive: true },
        (eventType, filename) => {
          this.handleFileSystemEvent(eventType, filename);
        }
      );

      this.watchers.set(this.secureDirectory, watcher);
      this.isWatching = true;

      console.log("File system watcher started for font security");
    } catch (error) {
      console.warn("Could not start file watcher:", error);
      // Continue without watcher - not critical
    }
  }

  /**
   * Handle file system events (potential security threats)
   */
  private handleFileSystemEvent(
    eventType: string,
    filename: string | null
  ): void {
    if (!filename) return;

    const filePath = path.join(this.secureDirectory, filename);

    console.warn(`Font security alert: ${eventType} detected on ${filename}`);

    // Implement defensive measures
    setTimeout(async () => {
      try {
        // Check if file still exists and is suspicious
        const stats = await fs.promises.stat(filePath);

        // If file was recently accessed (potential copy operation)
        const now = Date.now();
        const accessTime = stats.atime.getTime();

        if (now - accessTime < this.config.watcherSensitivity) {
          console.warn(
            `Suspicious access detected, implementing countermeasures`
          );

          // Log security event for audit
          this.logSecurityEvent(eventType, filename, stats);
        }
      } catch (error) {
        // File might have been deleted, which is fine
      }
    }, this.config.watcherSensitivity);
  }

  /**
   * Log security events for audit purposes
   */
  private logSecurityEvent(
    eventType: string,
    filename: string,
    stats: fs.Stats
  ): void {
    const event = {
      timestamp: new Date().toISOString(),
      eventType,
      filename,
      fileSize: stats.size,
      accessTime: stats.atime.toISOString(),
      modifyTime: stats.mtime.toISOString(),
      pid: process.pid,
    };

    console.warn("FONT_SECURITY_EVENT:", JSON.stringify(event));
  }

  /**
   * Secure file cleanup with overwriting
   */
  async secureDelete(filePath: string): Promise<void> {
    try {
      // First, overwrite file content with random data
      const stats = await fs.promises.stat(filePath);
      const randomData = crypto.randomBytes(stats.size);

      // Make file writable
      await chmod(filePath, 0o600);

      // Overwrite with random data
      await fs.promises.writeFile(filePath, randomData);

      // Finally delete
      await unlink(filePath);

      console.log(`Securely deleted: ${filePath}`);
    } catch (error) {
      console.error(`Failed to securely delete ${filePath}:`, error);
      // Fallback to regular deletion
      try {
        await chmod(filePath, 0o600);
        await unlink(filePath);
      } catch (fallbackError) {
        console.error("Fallback deletion also failed:", fallbackError);
      }
    }
  }

  /**
   * Cleanup all security measures
   */
  async cleanup(): Promise<void> {
    console.log("Cleaning up font security measures...");

    // Stop all watchers
    for (const [path, watcher] of this.watchers) {
      watcher.close();
      console.log(`Stopped watcher for: ${path}`);
    }
    this.watchers.clear();
    this.isWatching = false;

    // Secure delete all font files
    try {
      const files = await readdir(this.secureDirectory);

      for (const file of files) {
        const filePath = path.join(this.secureDirectory, file);
        await this.secureDelete(filePath);
      }
    } catch (error) {
      console.error("Error during secure cleanup:", error);
    }
  }

  /**
   * Get security status
   */
  getSecurityStatus(): {
    isWatching: boolean;
    secureDirectory: string;
    config: SecurityConfig;
    activeWatchers: number;
  } {
    return {
      isWatching: this.isWatching,
      secureDirectory: this.secureDirectory,
      config: this.config,
      activeWatchers: this.watchers.size,
    };
  }
}
