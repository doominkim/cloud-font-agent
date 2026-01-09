# Components Directory

이 디렉토리는 UI 컴포넌트를 포함합니다.

## 구조

```
components/
├── base/
│   └── Component.ts          # Base component class
├── auth/
│   ├── LoginPage.ts
│   ├── LoginForm.ts
│   └── OAuthButtons.ts       # ✓ Implemented (disabled for future)
├── layout/
│   ├── Header.ts
│   ├── Sidebar.ts
│   └── WindowControls.ts
├── font/
│   ├── FontList.ts
│   ├── FontItem.ts
│   ├── ProviderGroup.ts
│   └── FontInfoModal.ts
├── common/
│   ├── SearchBar.ts
│   ├── ToggleSwitch.ts
│   ├── Button.ts
│   └── Input.ts
├── OAuthButtons.ts           # ✓ Implemented
└── README.md
```

## 구현된 컴포넌트

### OAuthButtons

OAuth 로그인 버튼 컴포넌트 (Google, Apple, Naver)

**상태**: 구현 완료 (비활성화 상태 - 미래 확장용)

**Props**:

- `providers: OAuthProvider[]` - 표시할 OAuth 제공자 목록
- `onOAuthLogin: (provider: OAuthProvider) => Promise<void>` - OAuth 로그인 콜백

**주요 메서드**:

- `setLoading(provider, loading)` - 특정 제공자 버튼의 로딩 상태 설정
- `enableButtons()` - OAuth 버튼 활성화 (미래 사용)
- `disableButtons()` - OAuth 버튼 비활성화

**사용 예시**:

```typescript
const oauthButtons = new OAuthButtons({
  providers: ["google", "apple", "naver"],
  onOAuthLogin: async (provider) => {
    // Handle OAuth login
  },
});
```

## 컴포넌트 작성 가이드

각 컴포넌트는 Base Component 클래스를 상속받아 다음 패턴을 따릅니다:

```typescript
import { Component } from "./base/Component";

export interface ComponentProps {
  // Props definition
}

export class MyComponent extends Component<ComponentProps> {
  protected render(): HTMLElement {
    // Create and return DOM element
  }

  protected attachEventListeners(): void {
    // Attach event listeners (optional)
  }

  // Public methods for component interaction
}
```
