/**
 * Main Renderer Process
 * Initializes and manages the new UI components
 * Requirements: All
 */

import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { SearchBar } from "./components/SearchBar";
import { FontList } from "./components/FontList";
import { FontInfoModal } from "./components/FontInfoModal";
import { Font, NavigationItem } from "../types/ui";
import {
  loadSynchronizedFonts,
  handleFontToggle,
} from "./utils/font-integration";

/**
 * Application State
 */
interface AppState {
  fonts: Font[];
  searchQuery: string;
  activeNavItem: string;
  selectedFont: Font | null;
}

/**
 * Main Application Class
 */
class CloudFontAgentApp {
  private state: AppState = {
    fonts: [],
    searchQuery: "",
    activeNavItem: "home",
    selectedFont: null,
  };

  // Component instances
  private header: Header | null = null;
  private sidebar: Sidebar | null = null;
  private searchBar: SearchBar | null = null;
  private fontList: FontList | null = null;
  private fontInfoModal: FontInfoModal | null = null;

  // DOM containers
  private appContainer: HTMLElement | null = null;
  private mainContent: HTMLElement | null = null;

  /**
   * Initialize the application
   */
  public async init(): Promise<void> {
    console.log("Cloud Font Agent initialized");

    // Get app container
    this.appContainer = document.getElementById("app");
    if (!this.appContainer) {
      console.error("App container not found");
      return;
    }

    // Create layout structure
    this.createLayout();

    // Initialize components
    this.initializeComponents();

    // Load fonts
    await this.loadFonts();
  }

  /**
   * Create the main layout structure
   */
  private createLayout(): void {
    if (!this.appContainer) return;

    // Clear existing content
    this.appContainer.innerHTML = "";

    // Create main layout wrapper (for sidebar + main content)
    const mainLayout = document.createElement("div");
    mainLayout.className = "main-layout";

    // Create main content area
    this.mainContent = document.createElement("main");
    this.mainContent.className = "main-content";

    // Create search container
    const searchContainer = document.createElement("div");
    searchContainer.className = "main-content__search";

    // Create body container for font list
    const bodyContainer = document.createElement("div");
    bodyContainer.className = "main-content__body";

    // Append containers
    this.mainContent.appendChild(searchContainer);
    this.mainContent.appendChild(bodyContainer);
    mainLayout.appendChild(this.mainContent);
    this.appContainer.appendChild(mainLayout);
  }

  /**
   * Initialize all UI components
   */
  private initializeComponents(): void {
    // Initialize Header
    this.header = new Header({
      title: "Kerning City",
    });

    // Initialize Sidebar
    const navItems: NavigationItem[] = [
      { id: "home", icon: "🏠", label: "Home", active: true },
      { id: "messages", icon: "💬", label: "Messages", active: false },
      { id: "cloud", icon: "☁️", label: "Cloud", active: false },
    ];

    this.sidebar = new Sidebar({
      items: navItems,
      onNavigate: (itemId: string) => this.handleNavigation(itemId),
    });

    // Initialize SearchBar
    this.searchBar = new SearchBar({
      placeholder: "폰트 검색...",
      onSearch: (query: string) => this.handleSearch(query),
    });

    // Initialize FontList
    this.fontList = new FontList({
      fonts: this.state.fonts,
      searchQuery: this.state.searchQuery,
      onFontToggle: (fontId: string, enabled: boolean) =>
        this.handleFontToggle(fontId, enabled),
      onInfoClick: (fontId: string) => this.handleInfoClick(fontId),
    });

    // Render components to DOM
    if (this.appContainer && this.mainContent) {
      // Insert header at the top of app container
      this.appContainer.insertBefore(
        this.header.getElement(),
        this.appContainer.firstChild
      );

      // Get main layout wrapper
      const mainLayout = this.appContainer.querySelector(".main-layout");
      if (mainLayout) {
        // Insert sidebar at the beginning of main layout
        mainLayout.insertBefore(
          this.sidebar.getElement(),
          mainLayout.firstChild
        );
      }

      // Add search bar to search container
      const searchContainer = this.mainContent.querySelector(
        ".main-content__search"
      );
      if (searchContainer) {
        searchContainer.appendChild(this.searchBar.getElement());
      }

      // Add font list to body container
      const bodyContainer = this.mainContent.querySelector(
        ".main-content__body"
      );
      if (bodyContainer) {
        bodyContainer.appendChild(this.fontList.getElement());
      }
    }
  }

  /**
   * Load fonts from API and synchronize with system state
   */
  private async loadFonts(): Promise<void> {
    try {
      // Show loading state
      console.log("Loading fonts...");

      // Load synchronized fonts
      const fonts = await loadSynchronizedFonts();

      // Update state
      this.state.fonts = fonts;

      // Update font list
      if (this.fontList) {
        this.fontList.updateFonts(fonts);
      }

      console.log(`Loaded ${fonts.length} fonts`);
    } catch (error) {
      console.error("Failed to load fonts:", error);
      // Show error message to user
      alert(
        `폰트 목록을 불러오는데 실패했습니다.\n${
          error instanceof Error ? error.message : String(error)
        }`
      );
    }
  }

  /**
   * Handle navigation item click
   */
  private handleNavigation(itemId: string): void {
    console.log(`Navigation: ${itemId}`);
    this.state.activeNavItem = itemId;

    // Handle different navigation items
    switch (itemId) {
      case "home":
        // Show font list (default view)
        break;
      case "messages":
        // TODO: Show messages view
        alert("메시지 기능은 준비 중입니다.");
        break;
      case "cloud":
        // TODO: Show cloud sync status
        alert("클라우드 동기화 기능은 준비 중입니다.");
        break;
      case "settings":
        // TODO: Show settings
        alert("설정 기능은 준비 중입니다.");
        break;
    }
  }

  /**
   * Handle search query change
   */
  private handleSearch(query: string): void {
    console.log(`Search: ${query}`);
    this.state.searchQuery = query;

    // Update font list with new search query
    if (this.fontList) {
      this.fontList.updateSearch(query);
    }
  }

  /**
   * Handle font toggle (enable/disable)
   */
  private async handleFontToggle(
    fontId: string,
    enabled: boolean
  ): Promise<void> {
    console.log(`Font toggle: ${fontId} -> ${enabled}`);

    // Find the font
    const font = this.state.fonts.find((f) => f.id === fontId);
    if (!font) {
      console.error(`Font not found: ${fontId}`);
      return;
    }

    try {
      // Handle font toggle with error handling
      await handleFontToggle(
        fontId,
        enabled,
        font,
        (newEnabled: boolean) => {
          // Success callback: update font state
          font.enabled = newEnabled;
          if (this.fontList) {
            this.fontList.updateFonts([...this.state.fonts]);
          }
        },
        (error: string) => {
          // Error callback: show error message
          alert(`폰트 ${enabled ? "등록" : "해제"} 실패:\n${error}`);
        }
      );
    } catch (error) {
      // Error already handled by handleFontToggle
      console.error("Font toggle error:", error);
    }
  }

  /**
   * Handle info button click
   */
  private handleInfoClick(fontId: string): void {
    console.log(`Info click: ${fontId}`);

    // Find the font
    const font = this.state.fonts.find((f) => f.id === fontId);
    if (!font) {
      console.error(`Font not found: ${fontId}`);
      return;
    }

    // Store selected font
    this.state.selectedFont = font;

    // Create or update modal
    if (this.fontInfoModal) {
      this.fontInfoModal.destroy();
    }

    this.fontInfoModal = new FontInfoModal({
      fontInfo: {
        name: font.name,
        version: font.version,
        provider: `${font.providerNameKo} (${font.providerNameEn})`,
        license: font.license,
        fileSize: font.fileSize,
        previewText: "The quick brown fox jumps over the lazy dog",
      },
      onClose: () => this.handleModalClose(),
    });

    // Append modal to body
    document.body.appendChild(this.fontInfoModal.getElement());

    // Show modal
    this.fontInfoModal.show();
  }

  /**
   * Handle modal close
   */
  private handleModalClose(): void {
    if (this.fontInfoModal) {
      this.fontInfoModal.hide();
      this.state.selectedFont = null;
    }
  }
}

/**
 * Initialize the application on DOM load
 */
document.addEventListener("DOMContentLoaded", async () => {
  const app = new CloudFontAgentApp();
  await app.init();
});
