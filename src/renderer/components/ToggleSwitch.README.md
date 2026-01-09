# ToggleSwitch Component

폰트 활성화/비활성화를 위한 토글 스위치 컴포넌트입니다.

## Features

- ✅ 활성/비활성 상태 표시 (녹색/회색)
- ✅ 부드러운 애니메이션 효과
- ✅ 비활성화 상태 지원
- ✅ 접근성 지원 (네이티브 checkbox 사용)
- ✅ 프로그래밍 방식 상태 제어

## Usage

```typescript
import { ToggleSwitch } from "./components/ToggleSwitch";

// 기본 사용
const toggle = new ToggleSwitch({
  enabled: false,
  onChange: (enabled) => {
    console.log("Toggle state:", enabled);
  },
});

// 비활성화 상태로 생성
const disabledToggle = new ToggleSwitch({
  enabled: true,
  disabled: true,
  onChange: (enabled) => {
    // 비활성화 상태에서는 호출되지 않음
  },
});

// DOM에 마운트
toggle.mount(document.getElementById("container"));

// 프로그래밍 방식으로 상태 변경
toggle.setEnabled(true);

// 비활성화 상태 변경
toggle.setDisabled(true);

// 현재 상태 확인
const isEnabled = toggle.isEnabled();
```

## Props

| Prop       | Type                         | Required | Default | Description                     |
| ---------- | ---------------------------- | -------- | ------- | ------------------------------- |
| `enabled`  | `boolean`                    | Yes      | -       | 토글의 초기 활성화 상태         |
| `onChange` | `(enabled: boolean) => void` | Yes      | -       | 상태 변경 시 호출되는 콜백 함수 |
| `disabled` | `boolean`                    | No       | `false` | 토글 비활성화 여부              |

## Methods

### `setEnabled(enabled: boolean): void`

토글 상태를 프로그래밍 방식으로 설정합니다.

```typescript
toggle.setEnabled(true);
```

### `setDisabled(disabled: boolean): void`

토글의 비활성화 상태를 설정합니다.

```typescript
toggle.setDisabled(true);
```

### `isEnabled(): boolean`

현재 토글 상태를 반환합니다.

```typescript
const enabled = toggle.isEnabled();
```

## Styling

토글 스위치는 다음 CSS 클래스를 사용합니다:

- `.toggle` - 컨테이너
- `.toggle__input` - 숨겨진 체크박스 입력
- `.toggle__slider` - 슬라이더 요소

스타일은 `src/renderer/styles/components.css`에 정의되어 있습니다.

### CSS Variables

```css
--color-toggle-active: #34c759; /* 활성 상태 색상 (녹색) */
--color-toggle-inactive: #d1d1d6; /* 비활성 상태 색상 (회색) */
--transition-base: 0.2s ease; /* 애니메이션 속도 */
```

## Accessibility

- 네이티브 `<input type="checkbox">` 사용으로 키보드 접근성 보장
- `<label>` 요소로 클릭 영역 확대
- `disabled` 속성으로 비활성화 상태 명확히 표시

## Requirements

이 컴포넌트는 다음 요구사항을 충족합니다:

- **Requirement 4.2**: 토글 on → 폰트 등록
- **Requirement 4.3**: 토글 off → 폰트 해제
- **Requirement 4.4**: 활성 시 녹색, 비활성 시 회색
- **Requirement 4.5**: 등록 실패 시 에러 처리 및 토글 off 유지

## Example Integration

폰트 아이템과 함께 사용하는 예제:

```typescript
const fontToggle = new ToggleSwitch({
  enabled: font.enabled,
  onChange: async (enabled) => {
    try {
      // 토글 비활성화 (처리 중)
      fontToggle.setDisabled(true);

      if (enabled) {
        await fontManager.registerFont(font.id);
      } else {
        await fontManager.unregisterFont(font.id);
      }

      // 성공 시 상태 유지
      fontToggle.setEnabled(enabled);
    } catch (error) {
      // 실패 시 이전 상태로 롤백
      fontToggle.setEnabled(!enabled);
      console.error("Font toggle failed:", error);
    } finally {
      // 토글 다시 활성화
      fontToggle.setDisabled(false);
    }
  },
});
```
