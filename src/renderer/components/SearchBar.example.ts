/**
 * SearchBar Component Example
 *
 * This file demonstrates how to use the SearchBar component
 */

import { SearchBar } from "./SearchBar";
import { Font } from "../../types/ui";
import { filterFonts } from "../utils/search";

// Example: Basic SearchBar usage
export function createBasicSearchBar(): SearchBar {
  const searchBar = new SearchBar({
    placeholder: "폰트 검색...",
    onSearch: (query: string) => {
      console.log("Searching for:", query);
    },
  });

  return searchBar;
}

// Example: SearchBar with font filtering
export function createSearchBarWithFiltering(fonts: Font[]): SearchBar {
  const searchBar = new SearchBar({
    placeholder: "Search fonts...",
    onSearch: (query: string) => {
      const filteredFonts = filterFonts(fonts, query);
      console.log(`Found ${filteredFonts.length} fonts matching "${query}"`);
      // Update UI with filtered fonts
    },
  });

  return searchBar;
}

// Example: SearchBar with clear functionality
export function createSearchBarWithClear(): {
  searchBar: SearchBar;
  clearButton: HTMLButtonElement;
} {
  const searchBar = new SearchBar({
    placeholder: "폰트 검색...",
    onSearch: (query: string) => {
      console.log("Search query:", query);
    },
  });

  const clearButton = document.createElement("button");
  clearButton.textContent = "Clear";
  clearButton.className = "btn btn--secondary";
  clearButton.addEventListener("click", () => {
    searchBar.clear();
  });

  return { searchBar, clearButton };
}

// Example: Complete integration
export function setupSearchBarExample(): void {
  // Sample font data
  const sampleFonts: Font[] = [
    {
      id: "1",
      name: "탱타입 산돌고딕",
      version: "1.0.0",
      providerId: "taengtype",
      providerNameKo: "탱타입",
      providerNameEn: "Taengtype",
      enabled: false,
      downloadUrl: "https://example.com/font1",
      license: "OFL",
      fileSize: 1024000,
    },
    {
      id: "2",
      name: "eighttype 본고딕",
      version: "2.0.0",
      providerId: "eighttype",
      providerNameKo: "에잇타입",
      providerNameEn: "eighttype",
      enabled: false,
      downloadUrl: "https://example.com/font2",
      license: "OFL",
      fileSize: 2048000,
    },
  ];

  // Create search bar
  const searchBar = new SearchBar({
    placeholder: "폰트 검색... (예: 고딕, Taengtype)",
    onSearch: (query: string) => {
      const results = filterFonts(sampleFonts, query);
      console.log(`Search results for "${query}":`, results);

      // Display results
      displaySearchResults(results);
    },
  });

  // Mount to page
  const container = document.querySelector("#search-container");
  if (container) {
    searchBar.mount(container as HTMLElement);
  }
}

function displaySearchResults(fonts: Font[]): void {
  const resultsContainer = document.querySelector("#results");
  if (!resultsContainer) return;

  if (fonts.length === 0) {
    resultsContainer.innerHTML = "<p>No fonts found</p>";
    return;
  }

  resultsContainer.innerHTML = fonts
    .map(
      (font) => `
    <div class="font-item">
      <div class="font-item__details">
        <div class="font-item__name">${font.name}</div>
        <div class="font-item__version">v${font.version}</div>
      </div>
    </div>
  `
    )
    .join("");
}
