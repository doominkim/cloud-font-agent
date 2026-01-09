# Requirements Document

## Introduction

Cloud Font Agent의 UI를 현대적이고 사용자 친화적인 인터페이스로 재설계합니다. 기존의 단순한 목록 UI를 폰트 제공업체별로 그룹화하고, 검색 기능과 개별 폰트 활성화/비활성화 기능을 추가합니다.

## Glossary

- **Font_Agent**: 폰트 관리 애플리케이션
- **Sidebar**: 왼쪽 네비게이션 영역
- **Font_Provider**: 폰트 제공업체 (예: 탱타입, eighttype)
- **Font_Item**: 개별 폰트 항목
- **Toggle_Switch**: 폰트 활성화/비활성화 스위치
- **Search_Bar**: 폰트 검색 입력 필드

## Requirements

### Requirement 1: 사이드바 네비게이션

**User Story:** As a user, I want to navigate between different sections using a sidebar, so that I can access different features easily.

#### Acceptance Criteria

1. THE Sidebar SHALL display three navigation icons vertically
2. WHEN the home icon is clicked, THE Font_Agent SHALL display the main font list
3. WHEN the message icon is clicked, THE Font_Agent SHALL display notifications or messages
4. WHEN the cloud icon is clicked, THE Font_Agent SHALL display sync status
5. THE Sidebar SHALL have a settings menu icon at the bottom

### Requirement 2: 검색 기능

**User Story:** As a user, I want to search for fonts by name, so that I can quickly find specific fonts.

#### Acceptance Criteria

1. THE Search_Bar SHALL be displayed at the top of the main content area
2. WHEN a user types in the Search_Bar, THE Font_Agent SHALL filter Font_Items in real-time
3. THE Search_Bar SHALL have a search icon on the left side
4. WHEN the search query is empty, THE Font_Agent SHALL display all fonts
5. THE Search_Bar SHALL support Korean and English text input

### Requirement 3: 폰트 제공업체별 그룹화

**User Story:** As a user, I want to see fonts grouped by provider, so that I can easily browse fonts from specific foundries.

#### Acceptance Criteria

1. THE Font_Agent SHALL group Font_Items by Font_Provider
2. WHEN displaying Font_Providers, THE Font_Agent SHALL show the provider name with Korean and English names
3. THE Font_Agent SHALL display a collapse/expand icon for each Font_Provider group
4. WHEN a collapse icon is clicked, THE Font_Agent SHALL hide the Font_Items in that group
5. WHEN an expand icon is clicked, THE Font_Agent SHALL show the Font_Items in that group

### Requirement 4: 개별 폰트 활성화/비활성화

**User Story:** As a user, I want to enable or disable individual fonts, so that I can control which fonts are active in my system.

#### Acceptance Criteria

1. THE Font_Agent SHALL display a Toggle_Switch for each Font_Item
2. WHEN a Toggle_Switch is turned on, THE Font_Agent SHALL register that font with the system
3. WHEN a Toggle_Switch is turned off, THE Font_Agent SHALL unregister that font from the system
4. THE Toggle_Switch SHALL be green when active and gray when inactive
5. WHEN a font registration fails, THE Font_Agent SHALL display an error and keep the toggle in the off position

### Requirement 5: 폰트 정보 표시

**User Story:** As a user, I want to see detailed information about each font, so that I can make informed decisions about which fonts to use.

#### Acceptance Criteria

1. THE Font_Agent SHALL display an info icon next to each Font_Item
2. WHEN the info icon is clicked, THE Font_Agent SHALL display a modal with font details
3. THE Font_Agent SHALL display the font name and version number for each Font_Item
4. THE modal SHALL include font preview, license information, and file size
5. WHEN the modal is open, THE Font_Agent SHALL allow closing by clicking outside or pressing ESC

### Requirement 6: 상단 타이틀 영역

**User Story:** As a user, I want to see the application title, so that I know which application I'm using.

#### Acceptance Criteria

1. THE Font_Agent SHALL display "Kerning City" as the title at the top
2. THE title SHALL be centered in the header area
3. THE header SHALL have macOS window controls (close, minimize, maximize) on the left
4. THE header SHALL have a light background color
5. THE header SHALL remain fixed at the top when scrolling

### Requirement 7: 반응형 레이아웃

**User Story:** As a user, I want the interface to adapt to different window sizes, so that I can resize the window comfortably.

#### Acceptance Criteria

1. WHEN the window is resized, THE Font_Agent SHALL maintain the sidebar width
2. WHEN the window is resized, THE Font_Agent SHALL adjust the main content area width
3. THE Font_Agent SHALL display a scrollbar when content exceeds the visible area
4. THE minimum window width SHALL be 600 pixels
5. THE minimum window height SHALL be 400 pixels

### Requirement 8: 시각적 디자인

**User Story:** As a user, I want a clean and modern interface, so that the application is pleasant to use.

#### Acceptance Criteria

1. THE Font_Agent SHALL use a light color scheme with white and light gray backgrounds
2. THE Font_Agent SHALL use system fonts for UI text
3. THE Font_Agent SHALL use rounded corners for interactive elements
4. THE Font_Agent SHALL provide visual feedback on hover for clickable elements
5. THE Font_Agent SHALL use consistent spacing and alignment throughout the interface

### Requirement 9: 로그인 페이지

**User Story:** As a user, I want to log in to the application, so that I can access my personalized font library.

#### Acceptance Criteria

1. THE Font_Agent SHALL display a login page with "Kerning City" title at the top
2. THE Font_Agent SHALL provide email and password input fields with Korean placeholders ("이메일", "비밀번호")
3. THE Font_Agent SHALL display a login button ("로그인") that submits the credentials
4. THE Font_Agent SHALL provide links for "회원가입" (sign up) and "아이디 찾기" (find ID)
5. THE Font_Agent SHALL support future OAuth login options (Google, Apple, Naver)

### Requirement 10: 로그인 인증

**User Story:** As a user, I want secure authentication, so that my account is protected.

#### Acceptance Criteria

1. WHEN a user enters valid credentials and clicks login, THE Font_Agent SHALL authenticate the user and navigate to the main font list
2. WHEN a user enters invalid credentials, THE Font_Agent SHALL display an error message and keep the user on the login page
3. WHEN authentication is in progress, THE Font_Agent SHALL disable the login button and show a loading indicator
4. THE Font_Agent SHALL validate email format before submitting
5. THE Font_Agent SHALL store authentication tokens securely for session management
