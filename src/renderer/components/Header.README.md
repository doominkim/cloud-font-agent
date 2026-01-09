# Header Component

## Overview

The Header component displays the application title and macOS-style window controls at the top of the application.

## Requirements

This component satisfies the following requirements:

- **6.1**: Display "Kerning City" as the title at the top
- **6.2**: Center the title in the header area
- **6.3**: Include macOS window controls (close, minimize, maximize) on the left
- **6.4**: Use a light background color
- **6.5**: Remain fixed at the top when scrolling

## Features

- **macOS Window Controls**: Three colored buttons (red, yellow, green) for close, minimize, and maximize
- **Centered Title**: Application title centered in the header
- **Fixed Positioning**: Stays at the top of the viewport
- **Draggable Area**: Header acts as a drag region for moving the window (Electron feature)
- **Proper Z-Index**: Ensures header stays above other content

## Usage

### Basic Usage

```typescript
import { Header } from "./components/Header";

// Create header with title
const header = new Header({
  title: "Kerning City",
});

// Mount to DOM
const appContainer = document.getElementById("app");
header.mount(appContainer);
```

### Update Title

```typescript
// Update the title dynamically
header.update({
  title: "New Title",
});
```

### Cleanup

```typescript
// Remove from DOM and cleanup
header.destroy();
```

## Props

```typescript
interface HeaderProps {
  title: string; // The title to display in the header
}
```

## Styling

The Header component uses the following CSS classes:

- `.header` - Main header container
- `.header__title` - Title text
- `.window-controls` - Container for window control buttons
- `.window-controls__button` - Individual control button
- `.window-controls__button--close` - Close button (red)
- `.window-controls__button--minimize` - Minimize button (yellow)
- `.window-controls__button--maximize` - Maximize button (green)

All styles are defined in `src/renderer/styles/layout.css`.

## Window Control Functionality

The window control buttons communicate with the Electron main process via IPC:

- **Close**: Closes the window using `window.close()`
- **Minimize**: Sends `window:minimize` IPC message
- **Maximize**: Sends `window:maximize` IPC message (toggles between maximized and restored)

These require the Electron environment to function properly.

## Layout Integration

The Header component is designed to work with the main application layout:

```
┌─────────────────────────────────────────┐
│  ●  ●  ●    Kerning City               │ ← Header (52px height)
├────────┬────────────────────────────────┤
│        │                                │
│ Sidebar│  Main Content                  │
│        │                                │
└────────┴────────────────────────────────┘
```

The header has a fixed height of `52px` (defined as `--header-height` in CSS variables).

## Testing

To test the Header component in isolation, open `src/renderer/test-header.html` in a browser or Electron window.

## Dependencies

- Base Component class (`./base/Component`)
- CSS variables from `styles/variables.css`
- Layout styles from `styles/layout.css`
- Window API types from `src/types/window.d.ts`
