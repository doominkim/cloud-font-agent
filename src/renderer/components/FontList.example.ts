/**
 * FontList Component Example
 *
 * This file demonstrates how to use the FontList component with proper
 * state synchronization and font registration/unregistration
 */

import { FontList } from "./FontList";
import { Font } from "../../types/ui";
import { loadSynchronizedFonts } from "../utils/font-integration";
import { updateFontState } from "../utils/font-state";

// Sample font data
const sampleFonts: Font[] = [
  {
    id: "font-1",
    name: "탱타입 산스",
    version: "1.0.0",
    providerId: "taengtype",
    providerNameKo: "탱타입",
    providerNameEn: "Taengtype",
    enabled: false,
    downloadUrl: "https://example.com/font1.ttf",
    license: "Commercial",
    fileSize: 1024000,
  },
  {
    id: "font-2",
    name: "탱타입 세리프",
    version: "1.2.0",
    providerId: "taengtype",
    providerNameKo: "탱타입",
    providerNameEn: "Taengtype",
    enabled: true,
    downloadUrl: "https://example.com/font2.ttf",
    license: "Commercial",
    fileSize: 2048000,
  },
  {
    id: "font-3",
    name: "에잇타입 고딕",
    version: "2.0.0",
    providerId: "eighttype",
    providerNameKo: "eighttype",
    providerNameEn: "eighttype",
    enabled: false,
    downloadUrl: "https://example.com/font3.ttf",
    license: "Commercial",
    fileSize: 1536000,
  },
];

// Example 1: Basic usage
export function example1() {
  const fontList = new FontList({
    fonts: sampleFonts,
    searchQuery: "",
    onFontToggle: (fontId, enabled) => {
      console.log(`Font ${fontId} toggled to ${enabled}`);
    },
    onInfoClick: (fontId) => {
      console.log(`Info clicked for font ${fontId}`);
    },
  });

  return fontList.getElement();
}

// Example 2: With search query
export function example2() {
  const fontList = new FontList({
    fonts: sampleFonts,
    searchQuery: "탱타입",
    onFontToggle: (fontId, enabled) => {
      console.log(`Font ${fontId} toggled to ${enabled}`);
    },
    onInfoClick: (fontId) => {
      console.log(`Info clicked for font ${fontId}`);
    },
  });

  return fontList.getElement();
}

// Example 3: Empty state
export function example3() {
  const fontList = new FontList({
    fonts: [],
    searchQuery: "",
    onFontToggle: (fontId, enabled) => {
      console.log(`Font ${fontId} toggled to ${enabled}`);
    },
    onInfoClick: (fontId) => {
      console.log(`Info clicked for font ${fontId}`);
    },
  });

  return fontList.getElement();
}

// Example 4: Dynamic updates
export function example4() {
  const fontList = new FontList({
    fonts: sampleFonts,
    searchQuery: "",
    onFontToggle: (fontId, enabled) => {
      console.log(`Font ${fontId} toggled to ${enabled}`);
    },
    onInfoClick: (fontId) => {
      console.log(`Info clicked for font ${fontId}`);
    },
  });

  // Simulate search after 2 seconds
  setTimeout(() => {
    fontList.updateSearch("고딕");
  }, 2000);

  return fontList.getElement();
}

// Example 5: With state synchronization (Real-world usage)
// This example shows how to properly initialize the font list with
// synchronized state from the system
export async function example5() {
  let fonts: Font[] = [];

  try {
    // Load fonts with synchronized state
    // Requirements: 4.2, 4.3 - UI state matches system state
    fonts = await loadSynchronizedFonts();
  } catch (error) {
    console.error("Failed to load fonts:", error);
    // Use empty array on error
    fonts = [];
  }

  const fontList = new FontList({
    fonts,
    searchQuery: "",
    onFontToggle: (fontId, enabled) => {
      console.log(`Font ${fontId} toggled to ${enabled}`);

      // Update local state after successful toggle
      // Requirement 4.2, 4.3: Keep UI state synchronized
      fonts = updateFontState(fonts, fontId, enabled);
      fontList.updateFonts(fonts);
    },
    onInfoClick: (fontId) => {
      console.log(`Info clicked for font ${fontId}`);
      // Show font info modal
    },
  });

  return fontList.getElement();
}

// Example 6: Complete integration with error handling
// This example demonstrates the complete integration pattern with
// proper error handling and state rollback
export async function example6() {
  let fonts: Font[] = [];

  try {
    // Load fonts with synchronized state
    fonts = await loadSynchronizedFonts();
  } catch (error) {
    console.error("Failed to load fonts:", error);
    alert("폰트 목록을 불러오는데 실패했습니다.");
    fonts = [];
  }

  const fontList = new FontList({
    fonts,
    searchQuery: "",
    onFontToggle: (fontId, enabled) => {
      // This callback is only called on successful toggle
      // The FontItem component handles errors internally
      console.log(`Font ${fontId} successfully toggled to ${enabled}`);

      // Update local state
      fonts = updateFontState(fonts, fontId, enabled);
      fontList.updateFonts(fonts);
    },
    onInfoClick: (fontId) => {
      const font = fonts.find((f) => f.id === fontId);
      if (font) {
        console.log(`Showing info for: ${font.name}`);
        // Show font info modal with font details
      }
    },
  });

  return fontList.getElement();
}
