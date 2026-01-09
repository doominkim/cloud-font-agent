# Project Structure

Cloud Font Agent 렌더러 프로세스 구조

## 디렉토리 구조

```
src/renderer/
├── components/          # UI 컴포넌트
│   ├── base/           # 기본 컴포넌트 클래스
│   │   └── Component.ts
│   ├── auth/           # 인증 관련 컴포넌트
│   │   ├── LoginPage.ts
│   │   ├── LoginForm.ts
│   │   └── OAuthButtons.ts
│   ├── layout/         # 레이아웃 컴포넌트
│   │   ├── Header.ts
│   │   ├── Sidebar.ts
│   │   └── WindowControls.ts
│   ├── font/           # 폰트 관련 컴포넌트
│   │   ├── FontList.ts
│   │   ├── FontItem.ts
│   │   ├── ProviderGroup.ts
│   │   └── FontInfoModal.ts
│   ├── common/         # 공통 컴포넌트
│   │   ├── SearchBar.ts
│   │   ├── ToggleSwitch.ts
│   │   ├── Button.ts
│   │   └── Input.ts
│   └── README.md
│
├── styles/             # 스타일시트
│   ├── variables.css   # CSS 변수 (디자인 토큰)
│   ├── base.css        # 기본 스타일
│   ├── layout.css      # 레이아웃 스타일
│   ├── components.css  # 컴포넌트 스타일
│   ├── main.css        # 메인 스타일 (모든 스타일 import)
│   └── STYLE_GUIDE.md  # 스타일 가이드
│
├── utils/              # 유틸리티 함수
│   ├── dom.ts          # DOM 조작 헬퍼
│   ├── validation.ts   # 검증 함수
│   └── format.ts       # 포맷팅 함수
│
├── constants/          # 상수
│   └── index.ts        # 앱 상수
│
├── index.html          # HTML 엔트리 포인트
├── renderer.js         # 렌더러 메인 스크립트
├── preload.ts          # Preload 스크립트
└── PROJECT_STRUCTURE.md # 이 파일
```

## 컴포넌트 아키텍처

### 기본 원칙

1. **단일 책임 원칙**: 각 컴포넌트는 하나의 명확한 책임을 가집니다
2. **재사용성**: 공통 컴포넌트는 여러 곳에서 재사용 가능하도록 설계
3. **타입 안정성**: TypeScript를 사용하여 타입 안정성 보장
4. **이벤트 기반**: 컴포넌트 간 통신은 이벤트를 통해 수행

### 컴포넌트 계층

```
App (renderer.js)
├── LoginPage (인증되지 않은 경우)
│   ├── WindowControls
│   ├── LoginForm
│   │   ├── Input (email)
│   │   ├── Input (password)
│   │   └── Button (login)
│   └── OAuthButtons (future)
│
└── MainApp (인증된 경우)
    ├── Header
    │   ├── WindowControls
    │   └── Title
    ├── Sidebar
    │   ├── NavigationItem[]
    │   └── SettingsButton
    └── MainContent
        ├── SearchBar
        └── FontList
            └── ProviderGroup[]
                ├── ProviderHeader
                └── FontItem[]
                    ├── ToggleSwitch
                    └── InfoButton
```

## 스타일 시스템

### CSS 아키텍처

1. **variables.css**: 디자인 토큰 (색상, 간격, 타이포그래피 등)
2. **base.css**: 리셋 및 기본 스타일
3. **layout.css**: 레이아웃 관련 스타일
4. **components.css**: 컴포넌트별 스타일

### 네이밍 컨벤션

BEM (Block Element Modifier) 방식 사용:

```css
.block {
}
.block__element {
}
.block--modifier {
}
```

예시:

```css
.nav-item {
}
.nav-item__icon {
}
.nav-item--active {
}
```

## 상태 관리

현재는 간단한 상태 관리를 위해 클래스 기반 접근 방식 사용:

```typescript
interface UIState {
  isAuthenticated: boolean;
  currentUser: User | null;
  activeNavItem: string;
  searchQuery: string;
  // ...
}
```

향후 복잡도가 증가하면 상태 관리 라이브러리 도입 고려

## 데이터 흐름

```
User Action
    ↓
Component Event Handler
    ↓
API Call / State Update
    ↓
Component Re-render
    ↓
UI Update
```

## 빌드 프로세스

1. TypeScript 컴파일 (`npm run build:ts`)
2. 에셋 복사 (`npm run copy:assets`)
3. Native 모듈 빌드 (`npm run build:native`)

## 개발 가이드라인

### 새 컴포넌트 추가

1. `src/renderer/components/` 하위에 적절한 디렉토리에 파일 생성
2. `Component` 베이스 클래스 상속
3. Props 인터페이스 정의 (`src/types/ui.d.ts`)
4. `render()` 메서드 구현
5. 필요한 경우 이벤트 리스너 추가

### 스타일 추가

1. 컴포넌트별 스타일은 `components.css`에 추가
2. BEM 네이밍 컨벤션 준수
3. CSS 변수 사용 (하드코딩된 값 지양)

### 유틸리티 함수 추가

1. 적절한 카테고리의 파일에 추가 (`dom.ts`, `validation.ts`, `format.ts`)
2. JSDoc 주석으로 문서화
3. 순수 함수로 작성 (부작용 최소화)

## 테스트 전략

- 단위 테스트: 개별 컴포넌트 및 유틸리티 함수
- 속성 기반 테스트: 검색, 필터링, 상태 동기화 등
- 통합 테스트: 전체 사용자 플로우

## 향후 개선 사항

- [ ] 상태 관리 라이브러리 도입 (필요시)
- [ ] 컴포넌트 단위 테스트 추가
- [ ] 접근성 개선 (ARIA 속성, 키보드 네비게이션)
- [ ] 다크 모드 지원
- [ ] 국제화 (i18n) 지원
