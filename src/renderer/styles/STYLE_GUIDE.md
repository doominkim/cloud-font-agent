# Style Guide

Cloud Font Agent UI 디자인 시스템 가이드

## 색상 (Colors)

### 배경색

- `--color-background`: #ffffff - 주요 배경
- `--color-background-secondary`: #f5f5f7 - 보조 배경
- `--color-background-tertiary`: #e8e8ed - 3차 배경

### 텍스트

- `--color-text-primary`: #1d1d1f - 주요 텍스트
- `--color-text-secondary`: #86868b - 보조 텍스트
- `--color-text-tertiary`: #aeaeb2 - 3차 텍스트

### 테두리

- `--color-border`: #d2d2d7 - 기본 테두리
- `--color-border-light`: #e5e5ea - 밝은 테두리

### 브랜드 색상

- `--color-primary`: #007aff - 주요 액션
- `--color-primary-hover`: #0051d5 - 호버 상태
- `--color-primary-active`: #004bb8 - 활성 상태

### 상태 색상

- `--color-success`: #34c759 - 성공
- `--color-error`: #ff3b30 - 에러
- `--color-warning`: #ff9500 - 경고

## 간격 (Spacing)

8px 기반 시스템 사용:

- `--spacing-xs`: 4px
- `--spacing-sm`: 8px
- `--spacing-md`: 12px
- `--spacing-lg`: 16px
- `--spacing-xl`: 20px
- `--spacing-2xl`: 24px
- `--spacing-3xl`: 32px

## 타이포그래피 (Typography)

### 폰트 패밀리

```css
font-family: var(--font-family);
/* -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, ... */
```

### 폰트 크기

- `--font-size-xs`: 11px
- `--font-size-sm`: 12px
- `--font-size-base`: 14px (기본)
- `--font-size-md`: 15px
- `--font-size-lg`: 16px
- `--font-size-xl`: 18px
- `--font-size-2xl`: 20px
- `--font-size-3xl`: 24px
- `--font-size-4xl`: 28px

### 폰트 굵기

- `--font-weight-normal`: 400
- `--font-weight-medium`: 500
- `--font-weight-semibold`: 600
- `--font-weight-bold`: 700

## 모서리 (Border Radius)

- `--radius-sm`: 4px
- `--radius-md`: 6px
- `--radius-lg`: 8px
- `--radius-xl`: 12px
- `--radius-full`: 9999px (완전한 원)

## 그림자 (Shadows)

- `--shadow-sm`: 0 1px 3px rgba(0, 0, 0, 0.05) - 작은 그림자
- `--shadow-md`: 0 2px 6px rgba(0, 0, 0, 0.1) - 중간 그림자
- `--shadow-lg`: 0 4px 12px rgba(0, 0, 0, 0.15) - 큰 그림자

## 전환 효과 (Transitions)

- `--transition-fast`: 0.15s ease - 빠른 전환
- `--transition-base`: 0.2s ease - 기본 전환
- `--transition-slow`: 0.3s ease - 느린 전환

## 레이아웃 (Layout)

- `--sidebar-width`: 64px - 사이드바 너비
- `--header-height`: 52px - 헤더 높이
- `--window-min-width`: 600px - 최소 창 너비
- `--window-min-height`: 400px - 최소 창 높이

## 컴포넌트 사용 예시

### 버튼

```html
<button class="btn btn--primary">로그인</button>
<button class="btn btn--secondary">취소</button>
<button class="btn btn--ghost">더보기</button>
```

### 입력 필드

```html
<input type="text" class="input" placeholder="이메일" />
<input type="password" class="input" placeholder="비밀번호" />
```

### 토글 스위치

```html
<label class="toggle">
  <input type="checkbox" class="toggle__input" />
  <span class="toggle__slider"></span>
</label>
```

### 네비게이션 아이템

```html
<button class="nav-item nav-item--active">
  <span class="nav-item__icon">🏠</span>
</button>
```

## 접근성 (Accessibility)

- 모든 인터랙티브 요소는 키보드로 접근 가능해야 합니다
- `:focus-visible` 스타일이 적용되어 있습니다
- 색상 대비는 WCAG AA 기준을 충족합니다
- 스크린 리더를 위한 `.sr-only` 클래스를 제공합니다

## 반응형 디자인

- 최소 창 크기: 600x400px
- 사이드바는 고정 너비 (64px)
- 메인 콘텐츠는 가변 너비
- 스크롤은 메인 콘텐츠 영역에만 적용

## 애니메이션

- 모달: fadeIn + slideUp
- 토글 스위치: 슬라이드 애니메이션
- 호버 효과: 부드러운 색상/그림자 전환
- 접기/펼치기: max-height 전환
