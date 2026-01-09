/**
 * OAuthButtons Component
 * Requirements: 9.5
 *
 * Displays OAuth login buttons for Google, Apple, and Naver.
 * Currently in disabled state (준비 중) for future expansion.
 */

import { Component } from "./base/Component";
import { OAuthButtonsProps, OAuthProvider } from "../../types/ui";

export class OAuthButtons extends Component<OAuthButtonsProps> {
  private loadingProvider: OAuthProvider | null = null;

  protected render(): HTMLElement {
    const container = document.createElement("div");
    container.className = "login-page__oauth";

    // Create buttons container
    const buttonsContainer = document.createElement("div");
    buttonsContainer.className = "oauth-buttons";

    // Create buttons for each provider
    this.props.providers.forEach((provider) => {
      const button = this.createOAuthButton(provider);
      buttonsContainer.appendChild(button);
    });

    container.appendChild(buttonsContainer);

    // Add notice text
    const notice = document.createElement("p");
    notice.className = "oauth-notice";
    notice.textContent = "OAuth 로그인은 준비 중입니다";
    container.appendChild(notice);

    return container;
  }

  /**
   * Create an OAuth button for a specific provider
   */
  private createOAuthButton(provider: OAuthProvider): HTMLButtonElement {
    const button = document.createElement("button");
    button.className = "btn btn--secondary oauth-button";
    button.type = "button";
    button.disabled = true; // Disabled for future expansion
    button.dataset.provider = provider;

    // Create icon span
    const icon = document.createElement("span");
    icon.className = "oauth-button__icon";
    icon.textContent = this.getProviderIcon(provider);

    // Create text span
    const text = document.createElement("span");
    text.className = "oauth-button__text";
    text.textContent = this.getProviderText(provider);

    button.appendChild(icon);
    button.appendChild(text);

    return button;
  }

  /**
   * Get icon for OAuth provider
   */
  private getProviderIcon(provider: OAuthProvider): string {
    const icons: Record<OAuthProvider, string> = {
      google: "G",
      apple: "🍎",
      naver: "N",
    };
    return icons[provider];
  }

  /**
   * Get button text for OAuth provider
   */
  private getProviderText(provider: OAuthProvider): string {
    const texts: Record<OAuthProvider, string> = {
      google: "Google로 계속하기",
      apple: "Apple로 계속하기",
      naver: "Naver로 계속하기",
    };
    return texts[provider];
  }

  protected attachEventListeners(): void {
    // Get all OAuth buttons
    const buttons = this.element.querySelectorAll(".oauth-button");

    buttons.forEach((button) => {
      button.addEventListener("click", this.handleOAuthClick.bind(this));
    });
  }

  /**
   * Handle OAuth button click
   * Currently disabled, but prepared for future implementation
   */
  private async handleOAuthClick(event: Event): Promise<void> {
    const button = event.currentTarget as HTMLButtonElement;
    const provider = button.dataset.provider as OAuthProvider;

    if (!provider || button.disabled) {
      return;
    }

    try {
      this.setLoading(provider, true);
      await this.props.onOAuthLogin(provider);
    } catch (error) {
      console.error(`OAuth login failed for ${provider}:`, error);
    } finally {
      this.setLoading(provider, false);
    }
  }

  /**
   * Set loading state for a specific provider button
   *
   * @param provider - OAuth provider
   * @param loading - Loading state
   */
  public setLoading(provider: OAuthProvider, loading: boolean): void {
    this.loadingProvider = loading ? provider : null;

    const button = this.element.querySelector(
      `.oauth-button[data-provider="${provider}"]`
    ) as HTMLButtonElement;

    if (!button) return;

    if (loading) {
      button.disabled = true;
      const originalContent = button.innerHTML;
      button.dataset.originalContent = originalContent;
      button.innerHTML = '<span class="spinner"></span>';
    } else {
      const originalContent = button.dataset.originalContent;
      if (originalContent) {
        button.innerHTML = originalContent;
        delete button.dataset.originalContent;
      }
      // Keep disabled for future expansion
      button.disabled = true;
    }
  }

  /**
   * Enable OAuth buttons (for future use when OAuth is implemented)
   */
  public enableButtons(): void {
    const buttons = this.element.querySelectorAll(".oauth-button");
    buttons.forEach((button) => {
      (button as HTMLButtonElement).disabled = false;
    });

    // Update notice text
    const notice = this.element.querySelector(".oauth-notice");
    if (notice) {
      notice.textContent = "";
    }
  }

  /**
   * Disable OAuth buttons
   */
  public disableButtons(): void {
    const buttons = this.element.querySelectorAll(".oauth-button");
    buttons.forEach((button) => {
      (button as HTMLButtonElement).disabled = true;
    });

    // Update notice text
    const notice = this.element.querySelector(".oauth-notice");
    if (notice) {
      notice.textContent = "OAuth 로그인은 준비 중입니다";
    }
  }
}
