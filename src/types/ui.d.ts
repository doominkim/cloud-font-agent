// UI Component Types

// Authentication
export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: AuthToken;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

// Font Models
export interface Font {
  id: string;
  name: string;
  version: string;
  providerId: string;
  providerNameKo: string;
  providerNameEn: string;
  enabled: boolean;
  downloadUrl: string;
  license: string;
  fileSize: number;
}

export interface Provider {
  id: string;
  nameKo: string;
  nameEn: string;
}

export interface FontInfo {
  name: string;
  version: string;
  provider: string;
  license: string;
  fileSize: number;
  previewText: string;
}

// Navigation
export interface NavigationItem {
  id: string;
  icon: string;
  label: string;
  active: boolean;
}

// UI State
export interface UIState {
  isAuthenticated: boolean;
  currentUser: User | null;
  activeNavItem: string;
  searchQuery: string;
  collapsedProviders: Set<string>;
  selectedFontId: string | null;
  showInfoModal: boolean;
  loginError: string | null;
  isLoggingIn: boolean;
}

// Component Props
export interface HeaderProps {
  title: string;
}

export interface SidebarProps {
  items: NavigationItem[];
  onNavigate: (itemId: string) => void;
}

export interface SearchBarProps {
  placeholder: string;
  onSearch: (query: string) => void;
}

export interface ProviderGroupProps {
  provider: Provider;
  fonts: Font[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  onFontToggle: (fontId: string, enabled: boolean) => void;
  onInfoClick: (fontId: string) => void;
}

export interface FontItemProps {
  font: Font;
  onToggle: (enabled: boolean) => void;
  onInfoClick: () => void;
}

export interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

export interface FontInfoModalProps {
  fontInfo: FontInfo;
  onClose: () => void;
}

export interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignUp: () => void;
  onFindId: () => void;
}

export interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

export type OAuthProvider = "google" | "apple" | "naver";

export interface OAuthButtonsProps {
  providers: OAuthProvider[];
  onOAuthLogin: (provider: OAuthProvider) => Promise<void>;
}
