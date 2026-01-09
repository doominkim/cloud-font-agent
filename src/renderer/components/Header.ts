/**
 * Header Component
 *
 * Displays the application title and macOS window controls
 * Requirements: 6.1, 6.2, 6.3, 6.4, 6.5
 */

import { Component } from "./base/Component";

export interface HeaderProps {
  title: string;
}

export class Header extends Component<HeaderProps> {
  protected render(): HTMLElement {
    const header = document.createElement("header");
    header.className = "header";

    // Window controls (macOS style)
    const windowControls = this.createWindowControls();
    header.appendChild(windowControls);

    // Title
    const title = document.createElement("h1");
    title.className = "header__title";
    title.textContent = this.props.title;
    header.appendChild(title);

    return header;
  }

  /**
   * Create macOS window control buttons
   * Requirements: 6.3
   */
  private createWindowControls(): HTMLElement {
    const controls = document.createElement("div");
    controls.className = "window-controls";

    // Close button
    const closeBtn = document.createElement("button");
    closeBtn.className =
      "window-controls__button window-controls__button--close";
    closeBtn.setAttribute("aria-label", "Close window");
    closeBtn.addEventListener("click", () => this.handleClose());
    controls.appendChild(closeBtn);

    // Minimize button
    const minimizeBtn = document.createElement("button");
    minimizeBtn.className =
      "window-controls__button window-controls__button--minimize";
    minimizeBtn.setAttribute("aria-label", "Minimize window");
    minimizeBtn.addEventListener("click", () => this.handleMinimize());
    controls.appendChild(minimizeBtn);

    // Maximize button
    const maximizeBtn = document.createElement("button");
    maximizeBtn.className =
      "window-controls__button window-controls__button--maximize";
    maximizeBtn.setAttribute("aria-label", "Maximize window");
    maximizeBtn.addEventListener("click", () => this.handleMaximize());
    controls.appendChild(maximizeBtn);

    return controls;
  }

  /**
   * Handle close button click
   */
  private handleClose(): void {
    window.close();
  }

  /**
   * Handle minimize button click
   */
  private handleMinimize(): void {
    // This will be handled by the main process
    if (window.electronAPI?.minimize) {
      window.electronAPI.minimize();
    }
  }

  /**
   * Handle maximize button click
   */
  private handleMaximize(): void {
    // This will be handled by the main process
    if (window.electronAPI?.maximize) {
      window.electronAPI.maximize();
    }
  }
}
