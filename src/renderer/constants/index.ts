/**
 * Application Constants
 */

// Navigation Items
export const NAV_ITEMS = {
  HOME: "home",
  MESSAGES: "messages",
  CLOUD: "cloud",
  SETTINGS: "settings",
} as const;

// OAuth Providers
export const OAUTH_PROVIDERS = {
  GOOGLE: "google",
  APPLE: "apple",
  NAVER: "naver",
} as const;

// Local Storage Keys
export const STORAGE_KEYS = {
  AUTH_TOKEN: "auth_token",
  REFRESH_TOKEN: "refresh_token",
  USER_DATA: "user_data",
  COLLAPSED_PROVIDERS: "collapsed_providers",
  LAST_SEARCH: "last_search",
} as const;

// API Endpoints (placeholder - 실제 API 구현 시 업데이트)
export const API_ENDPOINTS = {
  LOGIN: "/api/auth/login",
  LOGOUT: "/api/auth/logout",
  REFRESH: "/api/auth/refresh",
  FONTS: "/api/fonts",
  PROVIDERS: "/api/providers",
} as const;

// UI Constants
export const UI_CONSTANTS = {
  SEARCH_DEBOUNCE_MS: 300,
  TOAST_DURATION_MS: 3000,
  MODAL_ANIMATION_MS: 200,
  MIN_PASSWORD_LENGTH: 6,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  INVALID_EMAIL: "올바른 이메일 주소를 입력해주세요.",
  INVALID_PASSWORD: "비밀번호는 최소 6자 이상이어야 합니다.",
  LOGIN_FAILED: "로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.",
  NETWORK_ERROR: "네트워크 오류가 발생했습니다. 다시 시도해주세요.",
  FONT_REGISTER_FAILED: "폰트 등록에 실패했습니다.",
  FONT_UNREGISTER_FAILED: "폰트 해제에 실패했습니다.",
  UNKNOWN_ERROR: "알 수 없는 오류가 발생했습니다.",
} as const;

// Success Messages
export const SUCCESS_MESSAGES = {
  LOGIN_SUCCESS: "로그인되었습니다.",
  LOGOUT_SUCCESS: "로그아웃되었습니다.",
  FONT_REGISTERED: "폰트가 등록되었습니다.",
  FONT_UNREGISTERED: "폰트가 해제되었습니다.",
} as const;

// Placeholder Text
export const PLACEHOLDERS = {
  EMAIL: "이메일",
  PASSWORD: "비밀번호",
  SEARCH: "폰트 검색...",
} as const;

// Button Labels
export const BUTTON_LABELS = {
  LOGIN: "로그인",
  LOGOUT: "로그아웃",
  SIGNUP: "회원가입",
  FIND_ID: "아이디 찾기",
  CANCEL: "취소",
  CONFIRM: "확인",
  CLOSE: "닫기",
  SYNC: "동기화",
} as const;
