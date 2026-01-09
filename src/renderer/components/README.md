# Components Directory

이 디렉토리는 UI 컴포넌트를 포함합니다.

## 구조

```
components/
├── auth/
│   ├── LoginPage.ts
│   ├── LoginForm.ts
│   └── OAuthButtons.ts
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
└── README.md
```

## 컴포넌트 작성 가이드

각 컴포넌트는 다음 패턴을 따릅니다:

```typescript
export interface ComponentProps {
  // Props definition
}

export class Component {
  private element: HTMLElement;

  constructor(private props: ComponentProps) {
    this.element = this.render();
  }

  private render(): HTMLElement {
    // Create and return DOM element
  }

  public getElement(): HTMLElement {
    return this.element;
  }

  // Public methods for component interaction
}
```
