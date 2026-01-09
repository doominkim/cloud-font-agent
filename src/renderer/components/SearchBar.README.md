# SearchBar Component

## Overview

The SearchBar component provides real-time font search functionality with support for Korean and English text input.

## Requirements

- 2.1: Display search bar at the top of main content area
- 2.2: Filter font items in real-time as user types
- 2.3: Display search icon on the left side
- 2.4: Display all fonts when search query is empty
- 2.5: Support Korean and English text input

## Usage

```typescript
import { SearchBar } from "./components/SearchBar";

const searchBar = new SearchBar({
  placeholder: "폰트 검색...",
  onSearch: (query: string) => {
    console.log("Search query:", query);
    // Filter fonts based on query
  },
});

// Mount to DOM
searchBar.mount(document.querySelector(".main-content"));

// Get current value
const currentQuery = searchBar.getValue();

// Clear search
searchBar.clear();
```

## Props

### SearchBarProps

```typescript
interface SearchBarProps {
  placeholder: string; // Placeholder text for the input field
  onSearch: (query: string) => void; // Callback fired on input change
}
```

## Methods

### getValue(): string

Returns the current search query value.

### clear(): void

Clears the search input and triggers the onSearch callback with an empty string.

## Styling

The component uses the following CSS classes:

- `.search-bar` - Container element
- `.search-bar__icon` - Search icon (🔍)
- `.search-bar__input` - Input field (extends `.input` base class)

## Features

- **Real-time filtering**: Triggers onSearch callback on every input change
- **Case-insensitive**: Search logic should be implemented case-insensitive
- **Korean/English support**: Native input supports all text input
- **Accessible**: Includes proper ARIA labels

## Example

See `SearchBar.example.ts` for a complete working example.
