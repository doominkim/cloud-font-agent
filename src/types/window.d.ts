// Global window type definitions for Electron IPC APIs

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

interface Window {
  fontAPI: {
    fetchFonts: () => Promise<PurchasedFont[]>;
    getRegisteredFonts: () => Promise<RegisteredFont[]>;
    syncFonts: () => Promise<SyncResult>;
    onSyncProgress: (callback: (progress: SyncProgress) => void) => void;
    registerFont: (
      fontId: string,
      downloadUrl: string,
      fontName: string
    ) => Promise<{ success: boolean; message?: string; error?: string }>;
    unregisterFont: (
      fontId: string
    ) => Promise<{ success: boolean; message?: string; error?: string }>;
  };
  authAPI: {
    login: (email: string, password: string) => Promise<LoginResponse>;
    logout: () => Promise<{ success: boolean }>;
    checkAuth: () => Promise<AuthCheckResponse>;
  };
  electronAPI?: {
    minimize: () => void;
    maximize: () => void;
  };
}
