# Font State Synchronization

This document explains how font state synchronization works in the Cloud Font Agent UI.

## Overview

The font registration/unregistration system ensures that the UI state always matches the actual system state. When a user toggles a font on or off, the system:

1. Attempts to register/unregister the font with the system
2. Updates the UI state only on success
3. Rolls back the UI state on failure
4. Displays error messages to the user

## Requirements

This implementation satisfies the following requirements:

- **Requirement 4.2**: Toggle on → registerFont call
- **Requirement 4.3**: Toggle off → unregisterFont call
- **Requirement 4.5**: Error handling and UI rollback

## Architecture

### IPC Communication Flow

```
Renderer Process                Main Process
┌─────────────────┐            ┌──────────────────┐
│   FontItem      │            │   FontManager    │
│   Component     │            │                  │
│                 │            │                  │
│  Toggle Change  │──register──▶│  registerFont() │
│                 │            │                  │
│                 │◀──result───│  Download +      │
│                 │            │  Register        │
│                 │            │                  │
│  Update UI      │            │                  │
│  or Rollback    │            │                  │
└─────────────────┘            └──────────────────┘
```

### State Synchronization

1. **Initial Load**: When the application starts, it fetches fonts from the API and registered fonts from the system, then synchronizes their states.

2. **Toggle Operation**: When a user toggles a font:

   - The toggle is disabled during processing
   - The IPC call is made to register/unregister
   - On success: UI state is updated, parent is notified
   - On failure: UI state is rolled back, error is shown

3. **Error Recovery**: If an error occurs:
   - The toggle returns to its previous state
   - An error message is displayed to the user
   - The parent component is NOT notified (state didn't change)

## Components

### FontItem Component

The `FontItem` component handles individual font toggles:

```typescript
private handleToggleChange = async (enabled: boolean): Promise<void> => {
  // Prevent concurrent operations
  if (this.isProcessing) return;

  this.isProcessing = true;
  this.toggleSwitch.setDisabled(true);

  try {
    if (enabled) {
      // Register font
      const result = await window.fontAPI.registerFont(
        this.props.font.id,
        this.props.font.downloadUrl,
        this.props.font.name
      );

      if (!result.success) {
        // Rollback on failure
        this.toggleSwitch.setEnabled(false);
        this.props.font.enabled = false;
        alert(`폰트 등록 실패: ${result.error}`);
      } else {
        // Update state on success
        this.props.font.enabled = true;
        this.props.onToggle(true);
      }
    } else {
      // Unregister font (similar logic)
    }
  } catch (error) {
    // Handle unexpected errors
    this.toggleSwitch.setEnabled(!enabled);
    this.props.font.enabled = !enabled;
    alert(`오류 발생: ${error.message}`);
  } finally {
    this.toggleSwitch.setDisabled(false);
    this.isProcessing = false;
  }
};
```

### Utility Functions

#### `syncFontStates()`

Synchronizes font enabled states with registered fonts from the system:

```typescript
export function syncFontStates(
  fonts: Font[],
  registeredFonts: Array<{ id: string; name: string; isActive: boolean }>
): Font[] {
  const registeredMap = new Map<string, boolean>();
  registeredFonts.forEach((rf) => {
    registeredMap.set(rf.id, rf.isActive);
  });

  return fonts.map((font) => ({
    ...font,
    enabled: registeredMap.has(font.id) && registeredMap.get(font.id) === true,
  }));
}
```

#### `loadSynchronizedFonts()`

Loads fonts from the API and synchronizes with system state:

```typescript
export async function loadSynchronizedFonts(): Promise<Font[]> {
  // Fetch purchased fonts from API
  const purchasedFonts = await window.fontAPI.fetchFonts();

  // Get currently registered fonts from system
  const registeredFonts = await window.fontAPI.getRegisteredFonts();

  // Convert and synchronize
  const fonts = convertToUIFonts(purchasedFonts);
  return syncFontStates(fonts, registeredFonts);
}
```

## Usage Example

### Complete Integration

```typescript
import { FontList } from "./components/FontList";
import { loadSynchronizedFonts } from "./utils/font-integration";
import { updateFontState } from "./utils/font-state";

async function initializeApp() {
  // Load fonts with synchronized state
  let fonts = await loadSynchronizedFonts();

  const fontList = new FontList({
    fonts,
    searchQuery: "",
    onFontToggle: (fontId, enabled) => {
      // Only called on successful toggle
      console.log(`Font ${fontId} toggled to ${enabled}`);

      // Update local state
      fonts = updateFontState(fonts, fontId, enabled);
      fontList.updateFonts(fonts);
    },
    onInfoClick: (fontId) => {
      // Show font info modal
    },
  });

  document.body.appendChild(fontList.getElement());
}
```

## Error Handling

### Registration Errors

When font registration fails:

1. The error is logged to the console
2. The toggle switch returns to the OFF position
3. The font's `enabled` state remains `false`
4. An alert is shown to the user with the error message
5. The parent component is NOT notified

### Unregistration Errors

When font unregistration fails:

1. The error is logged to the console
2. The toggle switch returns to the ON position
3. The font's `enabled` state remains `true`
4. An alert is shown to the user with the error message
5. The parent component is NOT notified

### Network Errors

If the font download fails during registration:

1. The error is caught by the main process
2. The font file is deleted (if partially downloaded)
3. The registration is aborted
4. An error result is returned to the renderer
5. The UI is rolled back as described above

## Testing

To test state synchronization:

1. **Initial Load**: Verify that fonts show correct enabled states on startup
2. **Successful Toggle**: Toggle a font and verify state updates
3. **Failed Registration**: Simulate a registration failure and verify rollback
4. **Failed Unregistration**: Simulate an unregistration failure and verify rollback
5. **Network Error**: Simulate a network error during download and verify cleanup

## Best Practices

1. **Always use `loadSynchronizedFonts()`** when initializing the font list
2. **Never manually set `font.enabled`** without calling the IPC methods
3. **Always handle the `onToggle` callback** to update parent state
4. **Don't assume toggle operations succeed** - they may fail
5. **Show user-friendly error messages** when operations fail

## Future Improvements

1. Add retry logic for failed operations
2. Implement optimistic UI updates with rollback
3. Add loading indicators during font download
4. Batch font operations for better performance
5. Add offline support with queued operations
