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

interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

interface LoginResponse {
  success: boolean;
  user?: User;
  token?: AuthToken;
  error?: string;
}

interface AuthCheckResponse {
  isAuthenticated: boolean;
  user: User | null;
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

  /**
   * Register an individual font
   * @param fontId - Font identifier
   * @param downloadUrl - URL to download the font from
   * @param fontName - Name of the font
   * @returns Promise resolving to registration result
   */
  registerFont: (
    fontId: string,
    downloadUrl: string,
    fontName: string
  ): Promise<{ success: boolean; message?: string; error?: string }> =>
    ipcRenderer.invoke("fonts:register", fontId, downloadUrl, fontName),

  /**
   * Unregister an individual font
   * @param fontId - Font identifier
   * @returns Promise resolving to unregistration result
   */
  unregisterFont: (
    fontId: string
  ): Promise<{ success: boolean; message?: string; error?: string }> =>
    ipcRenderer.invoke("fonts:unregister", fontId),
});

// Expose authentication API
contextBridge.exposeInMainWorld("authAPI", {
  /**
   * Login with email and password
   * @param email - User email
   * @param password - User password
   * @returns Promise resolving to login response
   */
  login: (email: string, password: string): Promise<LoginResponse> =>
    ipcRenderer.invoke("auth:login", email, password),

  /**
   * Logout current user
   * @returns Promise resolving when logout is complete
   */
  logout: (): Promise<{ success: boolean }> =>
    ipcRenderer.invoke("auth:logout"),

  /**
   * Check if user is authenticated
   * @returns Promise resolving to auth check response
   */
  checkAuth: (): Promise<AuthCheckResponse> => ipcRenderer.invoke("auth:check"),
});

// Expose window control API
contextBridge.exposeInMainWorld("electronAPI", {
  /**
   * Minimize the window
   */
  minimize: (): void => {
    ipcRenderer.send("window:minimize");
  },

  /**
   * Maximize/restore the window
   */
  maximize: (): void => {
    ipcRenderer.send("window:maximize");
  },
});
