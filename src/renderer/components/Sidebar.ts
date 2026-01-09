/**
 * Sidebar Component
 *
 * Displays navigation menu with icons for different sections
 * Requirements: 1.1, 1.2, 1.3, 1.4, 1.5
 */

import { Component } from "./base/Component";
import { NavigationItem, SidebarProps } from "../../types/ui";

export class Sidebar extends Component<SidebarProps> {
  protected render(): HTMLElement {
    const sidebar = document.createElement("aside");
    sidebar.className = "sidebar";

    // Navigation items
    const nav = document.createElement("nav");
    nav.className = "sidebar__nav";

    this.props.items.forEach((item) => {
      const navItem = this.createNavigationItem(item);
      nav.appendChild(navItem);
    });

    sidebar.appendChild(nav);

    // Settings button at the bottom
    const settings = document.createElement("div");
    settings.className = "sidebar__settings";
    const settingsBtn = this.createSettingsButton();
    settings.appendChild(settingsBtn);
    sidebar.appendChild(settings);

    return sidebar;
  }

  /**
   * Create a navigation item button
   * Requirements: 1.1
   */
  private createNavigationItem(item: NavigationItem): HTMLElement {
    const button = document.createElement("button");
    button.className = "nav-item";
    button.setAttribute("data-nav-id", item.id);
    button.setAttribute("aria-label", item.label);

    if (item.active) {
      button.classList.add("nav-item--active");
    }

    // Icon
    const icon = document.createElement("span");
    icon.className = "nav-item__icon";
    icon.textContent = item.icon;
    button.appendChild(icon);

    // Click handler
    button.addEventListener("click", () => {
      this.handleNavigate(item.id);
    });

    return button;
  }

  /**
   * Create settings button
   * Requirements: 1.5
   */
  private createSettingsButton(): HTMLElement {
    const button = document.createElement("button");
    button.className = "nav-item";
    button.setAttribute("data-nav-id", "settings");
    button.setAttribute("aria-label", "Settings");

    // Settings icon (gear/cog)
    const icon = document.createElement("span");
    icon.className = "nav-item__icon";
    icon.textContent = "⚙️";
    button.appendChild(icon);

    // Click handler
    button.addEventListener("click", () => {
      this.handleNavigate("settings");
    });

    return button;
  }

  /**
   * Handle navigation item click
   * Requirements: 1.2, 1.3, 1.4
   */
  private handleNavigate(itemId: string): void {
    // Update active state in UI
    this.setActive(itemId);

    // Call the onNavigate callback
    if (this.props.onNavigate) {
      this.props.onNavigate(itemId);
    }
  }

  /**
   * Set active navigation item
   * Requirements: 1.2, 1.3, 1.4
   */
  public setActive(itemId: string): void {
    // Remove active class from all items
    const allItems = this.element.querySelectorAll(".nav-item");
    allItems.forEach((item) => {
      item.classList.remove("nav-item--active");
    });

    // Add active class to the selected item
    const activeItem = this.element.querySelector(`[data-nav-id="${itemId}"]`);
    if (activeItem) {
      activeItem.classList.add("nav-item--active");
    }

    // Update props to reflect the change
    this.props.items = this.props.items.map((item) => ({
      ...item,
      active: item.id === itemId,
    }));
  }
}
