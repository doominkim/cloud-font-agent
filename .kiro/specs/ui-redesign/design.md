# Design Document

## Overview

Cloud Font Agent의 UI를 재설계하여 사용자 경험을 개선합니다. 기존의 단순한 목록 기반 UI를 현대적인 사이드바 네비게이션과 그룹화된 폰트 목록으로 변경하고, 개별 폰트 제어 기능을 추가합니다.

## Architecture

### UI 구조

**로그인 페이지:**

```
┌─────────────────────────────────────────┐
│  ●  ●  ●                                │
│                                         │
│                                         │
│           Kerning City                  │
│                                         │
│      ┌─────────────────────┐           │
│      │ 이메일              │           │
│      └─────────────────────┘           │
│      ┌─────────────────────┐           │
│      │ 비밀번호            │           │
│      └─────────────────────┘           │
│      ┌─────────────────────┐           │
│      │      로그인         │           │
│      └─────────────────────┘           │
│                                         │
│      회원가입        아이디 찾기        │
│                                         │
│    [OAuth buttons - future]             │
│                                         │
└─────────────────────────────────────────┘
```

**메인 애플리케이션:**

```
┌─────────────────────────────────────────┐
│  ●  ●  ●    Kerning City               │ Header
├────────┬────────────────────────────────┤
│        │  🔍 Search...                  │
│  🏠    │                                │
│        │  탱타입 (Taengtype)      ▼     │
│  💬    │    폰트1  ℹ️  [Toggle]         │
│        │    폰트2  ℹ️  [Toggle]         │
│  ☁️    │                                │
│        │  eighttype              ▼     │
│        │    폰트3  ℹ️  [Toggle]         │
│        │                                │
│  ⋮     │  활자도서관             ▲     │
│        │    폰트4  ℹ️  [Toggle]         │
│        │    폰트5  ℹ️  [Toggle]         │
└────────┴────────────────────────────────┘
Sidebar  Main Content Area
```

### 컴포넌트 계층

**로그인 페이지:**

```
LoginPage
├── WindowControls
├── Title
├── LoginForm
│   ├── EmailInput
│   ├── PasswordInput
│   ├── LoginButton
│   └── ErrorMessage
├── LinkGroup
│   ├── SignUpLink
│   └── FindIdLink
└── OAuthButtons (future)
    ├── GoogleButton
    ├── AppleButton
    └── NaverButton
```

**메인 애플리케이션:**

```
App
├── Header
│   ├── WindowControls
│   └── Title
├── Sidebar
│   ├── NavigationItem (Home)
│   ├── NavigationItem (Messages)
│   ├── NavigationItem (Cloud)
│   └── SettingsButton
└── MainContent
    ├── SearchBar
    └── FontList
        └── ProviderGroup[]
            ├── ProviderHeader
            │   ├── ProviderName
            │   └── CollapseButton
            └── FontItem[]
                ├── FontName
                ├── InfoButton
                └── ToggleSwitch
```

## Components and Interfaces

### 로그인 페이지 컴포넌트

#### 1. LoginPage Component

**책임**: 로그인 페이지 전체 레이아웃 관리

```typescript
interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<void>;
  onSignUp: () => void;
  onFindId: () => void;
}

class LoginPage {
  render(): HTMLElement;
  showError(message: string): void;
  clearError(): void;
  setLoading(loading: boolean): void;
}
```

#### 2. LoginForm Component

**책임**: 이메일/비밀번호 입력 및 로그인 처리

```typescript
interface LoginFormProps {
  onSubmit: (email: string, password: string) => Promise<void>;
}

interface LoginCredentials {
  email: string;
  password: string;
}

class LoginForm {
  render(): HTMLElement;
  validate(): boolean;
  getCredentials(): LoginCredentials;
  reset(): void;
  setDisabled(disabled: boolean): void;
}
```

#### 3. OAuthButtons Component (Future)

**책임**: OAuth 로그인 버튼 표시

```typescript
type OAuthProvider = "google" | "apple" | "naver";

interface OAuthButtonsProps {
  providers: OAuthProvider[];
  onOAuthLogin: (provider: OAuthProvider) => Promise<void>;
}

class OAuthButtons {
  render(): HTMLElement;
  setLoading(provider: OAuthProvider, loading: boolean): void;
}
```

### 메인 애플리케이션 컴포넌트

#### 1. Header Component

**책임**: 애플리케이션 타이틀과 윈도우 컨트롤 표시

```typescript
interface HeaderProps {
  title: string;
}

class Header {
  render(): HTMLElement;
}
```

#### 2. Sidebar Component

**책임**: 네비게이션 메뉴 제공

```typescript
interface NavigationItem {
  id: string;
  icon: string;
  label: string;
  active: boolean;
}

interface SidebarProps {
  items: NavigationItem[];
  onNavigate: (itemId: string) => void;
}

class Sidebar {
  render(): HTMLElement;
  setActive(itemId: string): void;
}
```

#### 3. SearchBar Component

**책임**: 폰트 검색 기능 제공

```typescript
interface SearchBarProps {
  placeholder: string;
  onSearch: (query: string) => void;
}

class SearchBar {
  render(): HTMLElement;
  getValue(): string;
  clear(): void;
}
```

#### 4. ProviderGroup Component

**책임**: 폰트 제공업체별 그룹 표시 및 접기/펼치기

```typescript
interface Provider {
  id: string;
  nameKo: string;
  nameEn: string;
}

interface ProviderGroupProps {
  provider: Provider;
  fonts: Font[];
  collapsed: boolean;
  onToggleCollapse: () => void;
  onFontToggle: (fontId: string, enabled: boolean) => void;
  onInfoClick: (fontId: string) => void;
}

class ProviderGroup {
  render(): HTMLElement;
  collapse(): void;
  expand(): void;
}
```

#### 5. FontItem Component

**책임**: 개별 폰트 정보 및 제어 표시

```typescript
interface Font {
  id: string;
  name: string;
  version: string;
  enabled: boolean;
  providerId: string;
}

interface FontItemProps {
  font: Font;
  onToggle: (enabled: boolean) => void;
  onInfoClick: () => void;
}

class FontItem {
  render(): HTMLElement;
  setEnabled(enabled: boolean): void;
}
```

#### 6. ToggleSwitch Component

**책임**: 폰트 활성화/비활성화 스위치

```typescript
interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  disabled?: boolean;
}

class ToggleSwitch {
  render(): HTMLElement;
  setEnabled(enabled: boolean): void;
  setDisabled(disabled: boolean): void;
}
```

#### 7. FontInfoModal Component

**책임**: 폰트 상세 정보 모달 표시

```typescript
interface FontInfo {
  name: string;
  version: string;
  provider: string;
  license: string;
  fileSize: number;
  previewText: string;
}

interface FontInfoModalProps {
  fontInfo: FontInfo;
  onClose: () => void;
}

class FontInfoModal {
  render(): HTMLElement;
  show(): void;
  hide(): void;
}
```

## Data Models

### Authentication Models

```typescript
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

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: User;
  token: AuthToken;
}
```

### Font Model

```typescript
interface Font {
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
```

### UIState Model

```typescript
interface UIState {
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
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Search filtering consistency

_For any_ search query, all displayed Font_Items should have names that contain the query string (case-insensitive)
**Validates: Requirements 2.2**

### Property 2: Toggle state synchronization

_For any_ Font_Item, when the Toggle_Switch is turned on, the font should be registered with the system and the enabled state should be true
**Validates: Requirements 4.2, 4.3**

### Property 3: Provider grouping completeness

_For all_ fonts in the system, each font should appear exactly once under its corresponding Font_Provider group
**Validates: Requirements 3.1, 3.2**

### Property 4: Collapse state persistence

_For any_ Font_Provider group, when collapsed then expanded, all Font_Items should remain in their previous enabled/disabled states
**Validates: Requirements 3.4, 3.5**

### Property 5: Search result ordering

_For any_ search query with results, Font_Items should maintain their provider grouping and original order within each group
**Validates: Requirements 2.2, 3.1**

### Property 6: Modal interaction isolation

_For any_ open FontInfoModal, clicking outside the modal or pressing ESC should close the modal without affecting font states
**Validates: Requirements 5.5**

### Property 7: Window resize layout preservation

_For any_ window resize operation, the Sidebar width should remain constant and the main content area should adjust proportionally
**Validates: Requirements 7.1, 7.2**

### Property 8: Toggle failure state consistency

_For any_ font registration failure, the Toggle_Switch should remain in the off position and the font enabled state should be false
**Validates: Requirements 4.5**

### Property 9: Login form validation

_For any_ email input, the login form should only enable the submit button when the email format is valid and password is non-empty
**Validates: Requirements 10.4**

### Property 10: Authentication state consistency

_For any_ successful login, the UI state should transition from login page to main application and isAuthenticated should be true
**Validates: Requirements 10.1**

### Property 11: Login error handling

_For any_ failed login attempt, the error message should be displayed and the login form should remain enabled for retry
**Validates: Requirements 10.2**

## Error Handling

### Font Registration Errors

- **Scenario**: Toggle switch turned on but font registration fails
- **Handling**:
  - Keep toggle in off position
  - Display error notification
  - Log error details
  - Do not update font enabled state

### Search Errors

- **Scenario**: Invalid search input or search processing error
- **Handling**:
  - Display all fonts (fallback to no filter)
  - Log error
  - Clear search input

### Provider Data Loading Errors

- **Scenario**: Font provider data fails to load
- **Handling**:
  - Display error message in provider group
  - Allow retry
  - Show cached data if available

### Modal Rendering Errors

- **Scenario**: Font info modal fails to render
- **Handling**:
  - Display simple alert with font name
  - Log error details
  - Close modal gracefully

## Testing Strategy

### Unit Tests

- Test each component renders correctly with various props
- Test SearchBar filtering logic with different queries
- Test ToggleSwitch state changes
- Test ProviderGroup collapse/expand functionality
- Test FontInfoModal show/hide behavior

### Property-Based Tests

Each property test should run minimum 100 iterations and be tagged with:
**Feature: ui-redesign, Property {number}: {property_text}**

1. **Search filtering**: Generate random font lists and search queries, verify all results match query
2. **Toggle synchronization**: Generate random toggle operations, verify system registration matches UI state
3. **Provider grouping**: Generate random font lists, verify each font appears exactly once
4. **Collapse state**: Generate random collapse/expand sequences, verify font states unchanged
5. **Search ordering**: Generate random searches, verify provider grouping maintained
6. **Modal isolation**: Generate random modal interactions, verify no state changes
7. **Window resize**: Generate random resize operations, verify layout constraints
8. **Toggle failure**: Generate random registration failures, verify consistent error state

### Integration Tests

- Test full user flow: search → select provider → toggle font → view info
- Test navigation between sidebar items
- Test window resize with active modals
- Test multiple simultaneous font toggles
- Test search with collapsed providers

### Visual Regression Tests

- Capture screenshots of each component state
- Compare against baseline images
- Test responsive layouts at different window sizes
- Test hover and active states
