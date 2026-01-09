# FontInfoModal Component

폰트 상세 정보를 표시하는 모달 컴포넌트입니다.

## Features

- 폰트 미리보기 텍스트 표시
- 폰트 이름, 버전, 제공업체, 라이선스, 파일 크기 정보 표시
- 닫기 버튼 클릭으로 모달 닫기
- 모달 외부 클릭으로 닫기
- ESC 키로 닫기
- 모달 열림 시 배경 스크롤 방지

## Props

```typescript
interface FontInfoModalProps {
  fontInfo: FontInfo;
  onClose: () => void;
}

interface FontInfo {
  name: string;
  version: string;
  provider: string;
  license: string;
  fileSize: number;
  previewText: string;
}
```

## Usage

```typescript
import { FontInfoModal } from "./components/FontInfoModal";

const fontInfo = {
  name: "Pretendard",
  version: "1.3.6",
  provider: "탱타입 (Taengtype)",
  license: "SIL Open Font License",
  fileSize: 2048576, // bytes
  previewText: "가나다라마바사 ABCDEFG 1234567",
};

const modal = new FontInfoModal({
  fontInfo: fontInfo,
  onClose: () => {
    console.log("Modal closed");
  },
});

// Mount to body
modal.mount(document.body);

// Show modal
modal.show();

// Hide modal
modal.hide();

// Check if visible
const isVisible = modal.isShown();

// Clean up
modal.destroy();
```

## Methods

### `show(): void`

모달을 표시합니다. 배경 스크롤을 방지합니다.

### `hide(): void`

모달을 숨깁니다. 배경 스크롤을 복원합니다.

### `isShown(): boolean`

모달이 현재 표시되고 있는지 확인합니다.

## Styling

모달 스타일은 `src/renderer/styles/components.css`에 정의되어 있습니다:

- `.modal-overlay`: 모달 배경 오버레이
- `.modal`: 모달 컨테이너
- `.font-info-modal`: FontInfoModal 전용 스타일
- `.font-info__preview`: 폰트 미리보기 섹션
- `.font-info__details`: 폰트 상세 정보 섹션

## Accessibility

- 닫기 버튼에 `aria-label` 속성 제공
- ESC 키로 모달 닫기 지원
- 모달 외부 클릭으로 닫기 지원

## Requirements

- Requirements 5.2: 정보 아이콘 클릭 시 모달 표시
- Requirements 5.4: 폰트 상세 정보 표시
- Requirements 5.5: 외부 클릭 및 ESC 키로 닫기
