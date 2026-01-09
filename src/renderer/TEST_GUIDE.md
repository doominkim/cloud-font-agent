# Integration and Edge Case Testing Guide

## Overview

This guide describes the comprehensive integration and edge case tests for the Cloud Font Agent UI redesign.

## Test Files

### 1. test-integration.html

**Purpose**: Full user flow integration tests

**Test Coverage**:

- **15.1 전체 사용자 플로우 테스트**
  - Search functionality
  - Provider group selection
  - Font toggle operations
  - Info modal interactions
  - Complete user journey from search to info view

**How to Run**:

1. Open `src/renderer/test-integration.html` in a browser
2. Click "Run Full Flow Test" for complete flow
3. Or run individual flow tests:
   - "Test Search Flow"
   - "Test Toggle Flow"
   - "Test Info Modal Flow"

**Expected Results**:

- All search operations filter correctly
- Font toggles update state properly
- Info modals open and close correctly
- No JavaScript errors in console

### 2. test-edge-cases.html

**Purpose**: Edge case and error handling tests

**Test Coverage**:

- **15.2 엣지 케이스 테스트**
  1. Empty font list handling
  2. No search results state
  3. Network error simulation
  4. Invalid font data handling
  5. Large font list performance (100 fonts)
  6. Special characters in search
  7. Rapid click handling
  8. Modal edge cases
  9. Memory leak detection
  10. Concurrent operations
  11. Unicode and emoji support
  12. State persistence

**How to Run**:

1. Open `src/renderer/test-edge-cases.html` in a browser
2. Click "Run Test" on any test card
3. View results in the preview area
4. Check test summary at the bottom

**Expected Results**:

- Empty states display correctly
- No crashes with invalid data
- Performance remains acceptable with large lists
- Special characters handled safely
- No memory leaks detected
- Unicode/emoji render correctly

## Test Requirements Validation

### Requirement Coverage

All tests validate requirements from the design document:

**Search Functionality (Req 2.2)**:

- Real-time filtering
- Case-insensitive search
- Korean/English support
- Empty query handling

**Provider Grouping (Req 3.1, 3.2)**:

- Fonts grouped by provider
- Correct provider names displayed
- Collapse/expand functionality

**Font Toggle (Req 4.2, 4.3, 4.5)**:

- Enable/disable functionality
- State synchronization
- Error handling

**Info Modal (Req 5.2, 5.5)**:

- Modal display
- Close interactions (ESC, outside click)
- Font details shown correctly

**Layout (Req 7.1-7.5)**:

- Responsive behavior
- Scroll handling
- Minimum window size

## Running Tests

### Manual Testing

1. **Open Test Files**:

   ```bash
   # From project root
   open src/renderer/test-integration.html
   open src/renderer/test-edge-cases.html
   ```

2. **Run Individual Tests**:

   - Click test buttons in the UI
   - Observe results in preview areas
   - Check browser console for errors

3. **Verify Results**:
   - Green (✓) = Pass
   - Red (✗) = Fail
   - Blue (ℹ) = Info
   - Yellow (⚠) = Warning

### Automated Testing

For automated testing in CI/CD:

```javascript
// Example: Puppeteer test runner
const puppeteer = require("puppeteer");

async function runTests() {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("file:///path/to/test-integration.html");
  await page.click("#runFullFlowTest");

  // Wait for tests to complete
  await page.waitForTimeout(5000);

  // Check results
  const passCount = await page.$eval("#passCount", (el) => el.textContent);
  const failCount = await page.$eval("#failCount", (el) => el.textContent);

  console.log(`Passed: ${passCount}, Failed: ${failCount}`);

  await browser.close();
}
```

## Test Scenarios

### Scenario 1: Complete User Flow

1. User opens application
2. User searches for "탱타입"
3. Results filter to show only matching fonts
4. User clicks provider group to expand
5. User toggles font on
6. Font state updates
7. User clicks info button
8. Modal opens with font details
9. User closes modal
10. Modal closes, state preserved

### Scenario 2: Empty State

1. Application loads with no fonts
2. Empty state message displays
3. User can still interact with UI
4. No errors occur

### Scenario 3: Search with No Results

1. User searches for non-existent font
2. "No results" message displays
3. User clears search
4. All fonts reappear

### Scenario 4: Network Error

1. Font toggle operation fails
2. Error message displays
3. Toggle returns to previous state
4. User can retry operation

### Scenario 5: Large Dataset

1. Application loads 100+ fonts
2. Rendering completes in < 1 second
3. Scroll performance is smooth
4. Search remains responsive

## Performance Benchmarks

### Acceptable Performance Metrics

- **Initial Render**: < 500ms for 50 fonts
- **Search Filter**: < 100ms response time
- **Toggle Operation**: < 200ms state update
- **Modal Open**: < 150ms animation
- **Large List (100 fonts)**: < 1000ms render

### Memory Usage

- **Initial Load**: < 50MB
- **After 100 Operations**: < 100MB increase
- **No Memory Leaks**: Stable after component destruction

## Known Limitations

1. **Network Error Testing**: Requires backend integration for full testing
2. **Performance Testing**: Results vary by browser and hardware
3. **Memory Testing**: Only available in Chrome with `performance.memory` API

## Troubleshooting

### Tests Not Running

**Problem**: Test buttons don't respond
**Solution**: Check browser console for module loading errors

**Problem**: Components not rendering
**Solution**: Verify all CSS files are loaded correctly

### Test Failures

**Problem**: Search tests fail
**Solution**: Verify search utility functions are working

**Problem**: Toggle tests fail
**Solution**: Check font state management logic

**Problem**: Modal tests fail
**Solution**: Ensure modal is properly appended to DOM

## Continuous Integration

### GitHub Actions Example

```yaml
name: Integration Tests

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - name: Setup Node
        uses: actions/setup-node@v2
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
```

## Test Maintenance

### Adding New Tests

1. Create test function in appropriate HTML file
2. Add button to trigger test
3. Add result container
4. Update this documentation

### Updating Tests

1. Modify test logic as needed
2. Update expected results
3. Re-run all tests to verify
4. Update documentation if behavior changes

## Conclusion

These integration and edge case tests provide comprehensive coverage of the UI redesign requirements. They validate:

- ✅ Full user flows work correctly
- ✅ Edge cases are handled gracefully
- ✅ Performance is acceptable
- ✅ No memory leaks
- ✅ Error handling works
- ✅ State management is correct

Run these tests regularly during development and before releases to ensure quality.
