# FontList Component

폰트 목록을 제공업체별로 그룹화하여 표시하는 컴포넌트입니다.

## Requirements

- **3.1**: 폰트를 제공업체별로 그룹화
- **2.2**: 검색 필터링 적용
- **7.3**: 스크롤 처리

## Features

- 폰트를 제공업체별로 자동 그룹화
- 실시간 검색 필터링
- 제공업체 그룹 접기/펼치기 상태 관리
- 검색 결과 없음 상태 표시
- 스크롤 가능한 목록

## Usage

```typescript
import { FontList } from "./components/FontList";

const fontList = new FontList({
  fonts: allFonts,
  searchQuery: "",
  onFontToggle: (fontId, enabled) => {
    console.log(`Font ${fontId} toggled to ${enabled}`);
  },
  onInfoClick: (fontId) => {
    console.log(`Info clicked for font ${fontId}`);
  },
});

document.getElementById("main-content").appendChild(fontList.getElement());

// Update search query
fontList.updateSearch("탱타입");

// Update font list
fontList.updateFonts(newFonts);
```

## Data Structure

### GroupedFonts

폰트를 제공업체별로 그룹화한 데이터 구조:

```typescript
interface GroupedFonts {
  provider: Provider;
  fonts: Font[];
}
```

### Grouping Logic

1. 폰트 배열을 `providerId`로 그룹화
2. 각 그룹에 제공업체 정보와 폰트 배열 포함
3. 제공업체 이름(한글)으로 정렬

## Methods

### `updateSearch(searchQuery: string)`

검색 쿼리를 업데이트하고 목록을 재렌더링합니다.

### `updateFonts(fonts: Font[])`

폰트 목록을 업데이트하고 재렌더링합니다.

## Styling

CSS 클래스:

- `.font-list`: 메인 컨테이너
- `.font-list__empty`: 빈 상태 컨테이너
- `.font-list__empty-hint`: 빈 상태 힌트 텍스트

## Implementation Notes

- 검색 필터링은 `filterFonts` 유틸리티 함수 사용
- 제공업체 그룹은 `ProviderGroup` 컴포넌트로 렌더링
- 접기/펼치기 상태는 내부 Set으로 관리
- 실제 상태 저장은 `ProviderGroup` 컴포넌트에서 처리
