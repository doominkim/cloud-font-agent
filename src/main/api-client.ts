/**
 * Mock API Client for Cloud Font Agent
 * Requirements: 1.1, 1.2, 8.1, 8.2, 8.3, 8.4, 8.5
 */

export interface PurchasedFont {
  id: string;
  name: string;
  downloadUrl: string;
  fileSize: number;
}

/**
 * Mock data for purchased fonts
 * Requirement 8.3: Minimum 3 sample fonts
 * Requirement 8.5: Public font file URLs
 * Using raw.githubusercontent.com for direct TTF/OTF downloads
 */
const MOCK_FONTS: PurchasedFont[] = [
  {
    id: "1",
    name: "Roboto",
    downloadUrl:
      "https://raw.githubusercontent.com/google/roboto/main/src/hinted/Roboto-Regular.ttf",
    fileSize: 515420,
  },
  {
    id: "2",
    name: "Open Sans",
    downloadUrl:
      "https://raw.githubusercontent.com/googlefonts/opensans/main/fonts/ttf/OpenSans-Regular.ttf",
    fileSize: 147472,
  },
  {
    id: "3",
    name: "Lato",
    downloadUrl:
      "https://raw.githubusercontent.com/google/fonts/main/ofl/lato/Lato-Regular.ttf",
    fileSize: 656812,
  },
];

/**
 * Mock API Client
 * Simulates the Font API Server for development and testing
 */
export class FontAPIClient {
  /**
   * Fetches the list of purchased fonts
   * Requirement 1.1: Fetch purchased fonts from API
   * Requirement 8.1: Use Mock API for font list
   * Requirement 8.2: Return same response format as real API
   *
   * @returns Promise resolving to array of purchased fonts
   */
  async fetchPurchasedFonts(): Promise<PurchasedFont[]> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 300));

    // Requirement 8.4: Include font name and download URL
    return [...MOCK_FONTS];
  }
}
