/**
 * Authentication Manager for Cloud Font Agent
 * Requirements: 10.1, 10.2, 10.3, 10.5
 */

import { safeStorage } from "electron";
import * as fs from "fs";
import * as path from "path";
import { app } from "electron";

export interface User {
  id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

export interface AuthToken {
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  user?: User;
  token?: AuthToken;
  error?: string;
}

/**
 * Mock users for development
 * In production, this would be replaced with actual API calls
 */
const MOCK_USERS = [
  {
    email: "test@example.com",
    password: "password123",
    user: {
      id: "1",
      email: "test@example.com",
      name: "Test User",
      createdAt: new Date(),
    },
  },
];

/**
 * Authentication Manager
 * Handles user authentication and token management
 */
export class AuthManager {
  private tokenFilePath: string;
  private currentUser: User | null = null;
  private currentToken: AuthToken | null = null;

  constructor() {
    // Store tokens in app data directory
    const userDataPath = app.getPath("userData");
    this.tokenFilePath = path.join(userDataPath, "auth-token.json");
  }

  /**
   * Initialize authentication manager
   * Load saved tokens if available
   * Requirement 10.5: Store authentication tokens securely
   */
  async initialize(): Promise<void> {
    try {
      await this.loadSavedToken();
    } catch (error) {
      console.error("Failed to load saved token:", error);
    }
  }

  /**
   * Authenticate user with email and password
   * Requirement 10.1: Authenticate user and navigate to main font list
   * Requirement 10.2: Display error message on invalid credentials
   *
   * @param email - User email
   * @param password - User password
   * @returns Login response with user and token
   */
  async login(email: string, password: string): Promise<LoginResponse> {
    try {
      // Simulate network delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Mock authentication - check against mock users
      const mockUser = MOCK_USERS.find(
        (u) => u.email === email && u.password === password
      );

      if (!mockUser) {
        return {
          success: false,
          error: "이메일 또는 비밀번호가 올바르지 않습니다.",
        };
      }

      // Generate mock token
      const token: AuthToken = {
        accessToken: this.generateMockToken(),
        refreshToken: this.generateMockToken(),
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
      };

      // Save user and token
      this.currentUser = mockUser.user;
      this.currentToken = token;

      // Persist token
      await this.saveToken(token);

      return {
        success: true,
        user: mockUser.user,
        token,
      };
    } catch (error) {
      console.error("Login error:", error);
      return {
        success: false,
        error: "로그인 중 오류가 발생했습니다.",
      };
    }
  }

  /**
   * Logout current user
   * Clear stored tokens
   */
  async logout(): Promise<void> {
    this.currentUser = null;
    this.currentToken = null;

    // Delete token file
    try {
      if (fs.existsSync(this.tokenFilePath)) {
        fs.unlinkSync(this.tokenFilePath);
      }
    } catch (error) {
      console.error("Failed to delete token file:", error);
    }
  }

  /**
   * Check if user is authenticated
   * @returns True if user is authenticated
   */
  isAuthenticated(): boolean {
    return this.currentUser !== null && this.currentToken !== null;
  }

  /**
   * Get current user
   * @returns Current user or null
   */
  getCurrentUser(): User | null {
    return this.currentUser;
  }

  /**
   * Get current token
   * @returns Current token or null
   */
  getCurrentToken(): AuthToken | null {
    return this.currentToken;
  }

  /**
   * Save token to file
   * Requirement 10.5: Store authentication tokens securely
   *
   * @param token - Token to save
   */
  private async saveToken(token: AuthToken): Promise<void> {
    try {
      const tokenData = JSON.stringify(token);

      // Use safeStorage if available (Electron 13+)
      if (safeStorage.isEncryptionAvailable()) {
        const encrypted = safeStorage.encryptString(tokenData);
        fs.writeFileSync(this.tokenFilePath, encrypted);
      } else {
        // Fallback to plain text (not recommended for production)
        fs.writeFileSync(this.tokenFilePath, tokenData);
      }
    } catch (error) {
      console.error("Failed to save token:", error);
      throw error;
    }
  }

  /**
   * Load saved token from file
   * Requirement 10.5: Store authentication tokens securely
   */
  private async loadSavedToken(): Promise<void> {
    try {
      if (!fs.existsSync(this.tokenFilePath)) {
        return;
      }

      const fileContent = fs.readFileSync(this.tokenFilePath);

      let tokenData: string;
      if (safeStorage.isEncryptionAvailable()) {
        tokenData = safeStorage.decryptString(fileContent);
      } else {
        tokenData = fileContent.toString();
      }

      const token: AuthToken = JSON.parse(tokenData);

      // Check if token is expired
      if (new Date(token.expiresAt) < new Date()) {
        console.log("Token expired");
        await this.logout();
        return;
      }

      this.currentToken = token;
      // Note: In production, you would validate the token with the server
      // and fetch the current user data
    } catch (error) {
      console.error("Failed to load saved token:", error);
    }
  }

  /**
   * Generate a mock token for development
   * @returns Random token string
   */
  private generateMockToken(): string {
    return (
      "mock_token_" +
      Math.random().toString(36).substring(2, 15) +
      Math.random().toString(36).substring(2, 15)
    );
  }
}
