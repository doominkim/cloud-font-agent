/**
 * Search Utilities
 *
 * Provides font search and filtering functionality
 * Requirements: 2.2, 2.4, 2.5
 */

import { Font } from "../../types/ui";

/**
 * Filter fonts by search query
 * Case-insensitive search supporting Korean and English text
 *
 * Requirements:
 * - 2.2: Filter fonts in real-time
 * - 2.4: Return all fonts when query is empty
 * - 2.5: Support Korean and English text input
 *
 * @param fonts - Array of fonts to filter
 * @param query - Search query string
 * @returns Filtered array of fonts
 */
export function filterFonts(fonts: Font[], query: string): Font[] {
  // Return all fonts when query is empty (Requirement 2.4)
  if (!query.trim()) {
    return fonts;
  }

  // Normalize query for case-insensitive search (Requirement 2.2)
  const normalizedQuery = query.toLowerCase().trim();

  // Filter fonts by name and provider (Requirements 2.2, 2.5)
  return fonts.filter((font) => {
    const fontName = font.name.toLowerCase();
    const providerKo = font.providerNameKo.toLowerCase();
    const providerEn = font.providerNameEn.toLowerCase();

    // Check if query matches font name or provider names
    // Supports both Korean and English (Requirement 2.5)
    return (
      fontName.includes(normalizedQuery) ||
      providerKo.includes(normalizedQuery) ||
      providerEn.includes(normalizedQuery)
    );
  });
}

/**
 * Normalize search query
 * Trims whitespace and converts to lowercase
 *
 * @param query - Raw search query
 * @returns Normalized query string
 */
export function normalizeQuery(query: string): string {
  return query.toLowerCase().trim();
}

/**
 * Check if a font matches a search query
 *
 * @param font - Font to check
 * @param query - Search query (should be normalized)
 * @returns True if font matches query
 */
export function fontMatchesQuery(font: Font, query: string): boolean {
  if (!query) {
    return true;
  }

  const fontName = font.name.toLowerCase();
  const providerKo = font.providerNameKo.toLowerCase();
  const providerEn = font.providerNameEn.toLowerCase();

  return (
    fontName.includes(query) ||
    providerKo.includes(query) ||
    providerEn.includes(query)
  );
}

/**
 * Highlight matching text in a string
 * Useful for displaying search results with highlighted matches
 *
 * @param text - Text to highlight
 * @param query - Search query
 * @returns HTML string with highlighted matches
 */
export function highlightMatch(text: string, query: string): string {
  if (!query.trim()) {
    return text;
  }

  const normalizedQuery = normalizeQuery(query);
  const regex = new RegExp(`(${escapeRegex(normalizedQuery)})`, "gi");

  return text.replace(regex, '<mark class="search-highlight">$1</mark>');
}

/**
 * Escape special regex characters
 *
 * @param str - String to escape
 * @returns Escaped string safe for regex
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
