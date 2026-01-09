/**
 * OAuthButtons Component Usage Example
 *
 * This file demonstrates how to integrate the OAuthButtons component
 * into the login page when OAuth functionality is ready to be enabled.
 */

import { OAuthButtons } from "./OAuthButtons";
import { OAuthProvider } from "../../types/ui";

/**
 * Example: Basic usage with all providers
 */
export function createOAuthButtonsBasic(): OAuthButtons {
  const oauthButtons = new OAuthButtons({
    providers: ["google", "apple", "naver"],
    onOAuthLogin: async (provider: OAuthProvider) => {
      console.log(`OAuth login initiated for: ${provider}`);

      // Future implementation:
      // 1. Open OAuth flow in browser
      // 2. Handle callback
      // 3. Exchange code for token
      // 4. Store token and navigate to main app

      throw new Error("OAuth not yet implemented");
    },
  });

  return oauthButtons;
}

/**
 * Example: Usage with selective providers
 */
export function createOAuthButtonsSelective(): OAuthButtons {
  const oauthButtons = new OAuthButtons({
    providers: ["google", "apple"], // Only Google and Apple
    onOAuthLogin: async (provider: OAuthProvider) => {
      console.log(`OAuth login initiated for: ${provider}`);
    },
  });

  return oauthButtons;
}

/**
 * Example: Integration into login page
 */
export function integrateIntoLoginPage(): void {
  // Create OAuth buttons component
  const oauthButtons = new OAuthButtons({
    providers: ["google", "apple", "naver"],
    onOAuthLogin: handleOAuthLogin,
  });

  // Mount to login page
  const loginPageContent = document.querySelector(
    ".login-page__content"
  ) as HTMLElement;
  if (loginPageContent) {
    oauthButtons.mount(loginPageContent);
  }
}

/**
 * Example OAuth login handler
 */
async function handleOAuthLogin(provider: OAuthProvider): Promise<void> {
  try {
    console.log(`Starting OAuth flow for ${provider}`);

    // Future implementation:
    // const result = await window.authAPI.oauthLogin(provider);
    // if (result.success) {
    //   // Navigate to main app
    // }

    alert(`OAuth login for ${provider} is not yet implemented`);
  } catch (error) {
    console.error(`OAuth login failed for ${provider}:`, error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    alert(`OAuth login failed: ${errorMessage}`);
  }
}

/**
 * Example: Enabling OAuth buttons when ready
 */
export function enableOAuthWhenReady(oauthButtons: OAuthButtons): void {
  // When OAuth is implemented and ready:
  oauthButtons.enableButtons();
}

/**
 * Example: Handling loading states
 */
export async function demonstrateLoadingState(
  oauthButtons: OAuthButtons,
  provider: OAuthProvider
): Promise<void> {
  // Show loading state
  oauthButtons.setLoading(provider, true);

  try {
    // Simulate OAuth flow
    await new Promise((resolve) => setTimeout(resolve, 2000));
  } finally {
    // Hide loading state
    oauthButtons.setLoading(provider, false);
  }
}
