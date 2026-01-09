# Sidebar Component

## Overview

The Sidebar component provides navigation for the Cloud Font Agent application. It displays vertical navigation icons for different sections (Home, Messages, Cloud) and a settings button at the bottom.

## Requirements

- **1.1**: Display three navigation icons vertically
- **1.2**: Handle home icon click to display main font list
- **1.3**: Handle message icon click to display notifications
- **1.4**: Handle cloud icon click to display sync status
- **1.5**: Display settings menu icon at the bottom

## Usage

```typescript
import { Sidebar } from "./components/Sidebar";
import { NavigationItem } from "../types/ui";

// Define navigation items
const navigationItems: NavigationItem[] = [
  {
    id: "home",
    icon: "🏠",
    label: "Home",
    active: true,
  },
  {
    id: "messages",
    icon: "💬",
    label: "Messages",
    active: false,
  },
  {
    id: "cloud",
    icon: "☁️",
    label: "Cloud Sync",
    active: false,
  },
];

// Create sidebar instance
const sidebar = new Sidebar({
  items: navigationItems,
  onNavigate: (itemId: string) => {
    console.log(`Navigated to: ${itemId}`);
    // Handle navigation logic here
  },
});

// Mount to DOM
const container = document.querySelector(".main-layout");
sidebar.mount(container);
```

## Props

### `SidebarProps`

| Property   | Type                     | Required | Description                                         |
| ---------- | ------------------------ | -------- | --------------------------------------------------- |
| items      | NavigationItem[]         | Yes      | Array of navigation items to display                |
| onNavigate | (itemId: string) => void | Yes      | Callback function when a navigation item is clicked |

### `NavigationItem`

| Property | Type    | Required | Description                               |
| -------- | ------- | -------- | ----------------------------------------- |
| id       | string  | Yes      | Unique identifier for the navigation item |
| icon     | string  | Yes      | Icon to display (emoji or icon font)      |
| label    | string  | Yes      | Accessible label for the navigation item  |
| active   | boolean | Yes      | Whether this item is currently active     |

## Methods

### `setActive(itemId: string): void`

Programmatically set the active navigation item.

```typescript
sidebar.setActive("messages");
```

## Styling

The Sidebar component uses the following CSS classes:

- `.sidebar` - Main sidebar container
- `.sidebar__nav` - Navigation items container
- `.sidebar__settings` - Settings button container
- `.nav-item` - Individual navigation button
- `.nav-item--active` - Active navigation item state
- `.nav-item__icon` - Navigation icon

Styles are defined in `src/renderer/styles/components.css` and `src/renderer/styles/layout.css`.

## Accessibility

- All navigation items have `aria-label` attributes for screen readers
- Keyboard navigation is supported through native button elements
- Active state is visually indicated with color and border

## Examples

See `Sidebar.example.ts` for complete usage examples including:

- Creating a basic sidebar
- Mounting to the DOM
- Programmatically changing active items
- Handling navigation events
