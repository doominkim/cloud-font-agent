/**
 * SearchBar Component
 *
 * Provides font search functionality with real-time filtering
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5
 */

import { Component } from "./base/Component";
import { SearchBarProps } from "../../types/ui";
import { createIcon } from "../utils/icons";

export class SearchBar extends Component<SearchBarProps> {
  private inputElement: HTMLInputElement | null = null;

  protected render(): HTMLElement {
    const container = document.createElement("div");
    container.className = "search-bar";

    // Search icon
    const iconContainer = document.createElement("span");
    iconContainer.className = "search-bar__icon";
    iconContainer.setAttribute("aria-hidden", "true");
    const icon = createIcon("search");
    iconContainer.appendChild(icon);
    container.appendChild(iconContainer);

    // Search input
    const input = document.createElement("input");
    input.type = "text";
    input.className = "input search-bar__input";
    input.placeholder = this.props.placeholder;
    input.setAttribute("aria-label", "Search fonts");
    container.appendChild(input);

    // Store reference to input element
    this.inputElement = input;

    return container;
  }

  protected attachEventListeners(): void {
    if (this.inputElement) {
      // Real-time search on input
      this.inputElement.addEventListener("input", (e) => {
        const target = e.target as HTMLInputElement;
        this.handleSearch(target.value);
      });
    }
  }

  /**
   * Handle search input changes
   * Requirements: 2.2, 2.4, 2.5
   */
  private handleSearch(query: string): void {
    if (this.props.onSearch) {
      this.props.onSearch(query);
    }
  }

  /**
   * Get current search value
   */
  public getValue(): string {
    return this.inputElement?.value || "";
  }

  /**
   * Clear search input
   */
  public clear(): void {
    if (this.inputElement) {
      this.inputElement.value = "";
      this.handleSearch("");
    }
  }
}
