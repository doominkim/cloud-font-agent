# ProviderGroup Component

폰트 제공업체별로 폰트를 그룹화하여 표시하고 접기/펼치기 기능을 제공하는 컴포넌트입니다.

## Features

- 제공업체 이름 표시 (한글/영문)
- 접기/펼치기 아이콘 및 애니메이션
- FontItem 목록 컨테이너
- 상태 관리 (collapsed/expanded)

## Props

```typescript
interface ProviderGroupProps {
  provider: Provider; // 제공업체 정보
  fonts: Font[]; // 폰트 목록
  collapsed: boolean; // 접힌 상태
  onToggleCollapse: () => void; // 접기/펼치기 콜백
  onFontToggle: (fontId: string, enabled: boolean) => void; // 폰트 토글 콜백
  onInfoClick: (fontId: string) => void; // 정보 버튼 클릭 콜백
}
```

## Usage

```typescript
import { ProviderGroup } from "./components/ProviderGroup";

const providerGroup = new ProviderGroup({
  provider: {
    id: "taengtype",
    nameKo: "탱타입",
    nameEn: "Taengtype",
  },
  fonts: [
    {
      id: "font1",
      name: "탱타입 고딕",
      version: "1.0.0",
      providerId: "taengtype",
      providerNameKo: "탱타입",
      providerNameEn: "Taengtype",
      enabled: false,
      downloadUrl: "https://example.com/font1",
      license: "OFL",
      fileSize: 1024000,
    },
  ],
  collapsed: false,
  onToggleCollapse: () => {
    console.log("Toggle collapse");
  },
  onFontToggle: (fontId, enabled) => {
    console.log(`Font ${fontId} toggled: ${enabled}`);
  },
  onInfoClick: (fontId) => {
    console.log(`Info clicked for font ${fontId}`);
  },
});

providerGroup.mount(document.body);
```

## Methods

### `collapse()`

그룹을 접습니다.

```typescript
providerGroup.collapse();
```

### `expand()`

그룹을 펼칩니다.

```typescript
providerGroup.expand();
```

### `destroy()`

컴포넌트를 정리하고 이벤트 리스너를 제거합니다.

```typescript
providerGroup.destroy();
```

## Styling

컴포넌트는 다음 CSS 클래스를 사용합니다:

- `.provider-group` - 컨테이너
- `.provider-group__header` - 헤더 (클릭 가능)
- `.provider-group__name` - 제공업체 이름
- `.provider-group__toggle` - 접기/펼치기 아이콘
- `.provider-group__toggle--collapsed` - 접힌 상태 아이콘
- `.provider-group__content` - 폰트 목록 컨테이너
- `.provider-group__content--collapsed` - 접힌 상태 컨텐츠

## Requirements

- Requirements 3.2: 제공업체 이름 표시
- Requirements 3.3: 접기/펼치기 아이콘
- Requirements 3.4: 접기 기능
- Requirements 3.5: 펼치기 기능
