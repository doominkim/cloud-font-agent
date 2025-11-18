import { contextBridge, ipcRenderer } from "electron";

// Type definitions for the exposed API
interface PurchasedFont {
  id: string;
  name: string;
  downloadUrl: string;
  fileSize: number;
}

interface RegisteredFont {
  id: string;
  name: string;
  filePath: string;
  registeredAt: Date;
  isActive: boolean;
}

interface SyncProgress {
  total: number;
  completed: number;
  current: string;
  percentage: number;
}

interface SyncResult {
  success: number;
  failed: number;
  errors: Array<{ fontName: string; error: string }>;
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("fontAPI", {
  /**
   * Fetch the list of purchased fonts from the API
   * @returns Promise resolving to array of purchased fonts
   */
  fetchFonts: (): Promise<PurchasedFont[]> => ipcRenderer.invoke("fonts:fetch"),

  /**
   * Get the list of currently registered fonts
   * @returns Promise resolving to array of registered fonts
   */
  getRegisteredFonts: (): Promise<RegisteredFont[]> =>
    ipcRenderer.invoke("fonts:registered"),

  /**
   * Start synchronizing all fonts (download and register)
   * @returns Promise resolving to sync result
   */
  syncFonts: (): Promise<SyncResult> => ipcRenderer.invoke("fonts:sync"),

  /**
   * Register a callback for sync progress updates
   * @param callback Function to call when progress updates
   */
  onSyncProgress: (callback: (progress: SyncProgress) => void): void => {
    ipcRenderer.on("sync:progress", (_event, progress) => callback(progress));
  },
});
