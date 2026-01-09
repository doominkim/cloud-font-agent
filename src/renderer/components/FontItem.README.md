# FontItem Component

개별 폰트 정보 및 제어를 표시하는 컴포넌트입니다.

## Features

- 폰트 이름 및 버전 표시
- 정보 아이콘 버튼
- ToggleSwitch 통합 (폰트 활성화/비활성화)
- 호버 효과 및 그림자

## Props

```typescript
interface FontItemProps {
  font: Font;
  onToggle: (enabled: boolean) => void;
  onInfoClick: () => void;
}

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

## Usage

```typescript
import { FontItem } from "./components/FontItem";

const font = {
  id: "font-1",
  name: "Pretendard",
  version: "1.3.6",
  providerId: "taengtype",
  providerNameKo: "탱타입",
  providerNameEn: "Taengtype",
  enabled: false,
  downloadUrl: "https://example.com/font.zip",
  license: "OFL",
  fileSize: 1024000,
};

const fontItem = new FontItem({
  font: font,
  onToggle: (enabled) => {
    console.log(`Font ${enabled ? "enabled" : "disabled"}`);
  },
  onInfoClick: () => {
    console.log("Show font info modal");
  },
});

fontItem.mount(document.getElementById("font-list"));
```

## Methods

### `setEnabled(enabled: boolean)`

폰트 활성화 상태를 프로그래밍 방식으로 설정합니다.

```typescript
fontItem.setEnabled(true);
```

### `destroy()`

컴포넌트를 정리하고 이벤트 리스너를 제거합니다.

```typescript
fontItem.destroy();
```

## Structure

```
.font-item
├── .font-item__info
│   └── .font-item__details
│       ├── .font-item__name
│       └── .font-item__version
└── .font-item__actions
    ├── .font-item__info-btn
    └── .toggle (ToggleSwitch)
```

## Styling

컴포넌트는 `src/renderer/styles/components.css`에 정의된 스타일을 사용합니다:

- `.font-item`: 메인 컨테이너
- `.font-item__info`: 폰트 정보 영역
- `.font-item__details`: 이름과 버전 컨테이너
- `.font-item__name`: 폰트 이름
- `.font-item__version`: 버전 정보
- `.font-item__actions`: 액션 버튼 영역
- `.font-item__info-btn`: 정보 버튼

## Requirements

- Requirements 5.3: 폰트 이름 및 버전 표시
- Requirements 4.2, 4.3: 토글 변경 이벤트
- Requirements 5.2: 정보 버튼 클릭 이벤트
