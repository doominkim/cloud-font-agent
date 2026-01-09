# Layout Overflow Analysis - SOLVED! 🎉

## Problem

The search input and font items were overflowing beyond the layout boundaries to the right.

## Root Cause (ACTUAL)

The issue was caused by **`min-width: 600px` on `.app` container** conflicting with the actual window width of **491px**.

### The Real Problem

```css
.app {
  width: 100vw; /* 491px actual window width */
  min-width: var(
    --window-min-width
  ); /* 600px - FORCED the layout to be wider! */
}
```

When the window is 491px wide but CSS forces `min-width: 600px`, the layout becomes 600px wide, causing all content to overflow by **109px**!

### Window Configuration

From `src/main/index.ts`:

```typescript
mainWindow = new BrowserWindow({
  width: 491, // Figma design width
  height: 864, // Figma design height
  resizable: false,
  // ...
});
```

The window is intentionally **491px wide** (Figma design), but the CSS was enforcing a **600px minimum width**.

## Solution Applied

### 1. Remove min-width from .app

```css
/* BEFORE */
.app {
  width: 100vw;
  min-width: var(--window-min-width); /* 600px - WRONG! */
}

/* AFTER */
.app {
  width: 100vw; /* Now correctly uses 491px */
  /* min-width removed */
}
```

### 2. Remove min-height from .main-layout

```css
/* BEFORE */
.main-layout {
  height: calc(100vh - var(--header-height));
  min-height: calc(var(--window-min-height) - var(--header-height));
}

/* AFTER */
.main-layout {
  height: calc(100vh - var(--header-height));
  /* min-height removed */
}
```

### 3. Remove responsive media queries

```css
/* REMOVED - These were re-applying the min-width constraint */
@media (max-width: 600px) {
  .app {
    min-width: var(--window-min-width);
  }
}
```

## Why This Happened

The CSS variables were originally designed for a responsive web app with a minimum width of 600px. However, this Electron app has a **fixed window size of 491px** (from Figma design), making the min-width constraint incompatible.

## Verification

- Window width: **491px** ✓
- Layout width: **491px** (no longer forced to 600px) ✓
- Search input: fits within layout ✓
- Font items: no overflow ✓
- Info buttons & toggles: fully visible ✓

## Key Lesson

**Always check if CSS min-width/min-height constraints match the actual window dimensions in Electron apps!**

Fixed window size (Electron) ≠ Responsive design constraints (Web)
