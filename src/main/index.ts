import {
  app,
  BrowserWindow,
  Tray,
  screen,
  nativeImage,
  Menu,
  ipcMain,
} from "electron";
import * as path from "path";
import * as fs from "fs";
import axios from "axios";
import { createCanvas } from "canvas";
import { FontManager } from "./font-manager";
import { SyncManager } from "./sync-manager";
import { FontAPIClient } from "./api-client";
import { AuthManager } from "./auth-manager";

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let fontManager: FontManager | null = null;
let syncManager: SyncManager | null = null;
let apiClient: FontAPIClient | null = null;
let authManager: AuthManager | null = null;

function createWindow() {
  // Requirements 5.1, 5.2, 5.3, 5.4, 5.5
  mainWindow = new BrowserWindow({
    width: 491, // Figma design width
    height: 864, // Figma design height
    show: false,
    frame: false, // Frameless window for widget style
    resizable: false, // Cannot resize
    movable: false, // Cannot move - stays under tray icon
    transparent: false,
    skipTaskbar: true,
    alwaysOnTop: true, // Requirement 5.2: Always on top
    webPreferences: {
      preload: path.join(__dirname, "../renderer/preload.js"), // Preload script setup
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Check if user is authenticated
  // Requirement 10.1: Navigate to main app if authenticated, otherwise show login
  if (authManager && authManager.isAuthenticated()) {
    mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
  } else {
    mainWindow.loadFile(path.join(__dirname, "../renderer/login.html"));
  }

  // Open DevTools (always open for debugging)
  mainWindow.webContents.openDevTools({ mode: "detach" });

  mainWindow.on("blur", () => {
    if (mainWindow && !mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide();
    }
  });

  // Requirement 5.5: When user closes the window, the app should quit
  mainWindow.on("closed", () => {
    mainWindow = null;
    app.quit();
  });

  console.log("Window created");
}

function createTray() {
  console.log("Creating tray...");

  // macOS 메뉴바용 텍스트 기반 아이콘 생성
  // "CF" (Cloud Font) 텍스트를 Canvas로 렌더링
  const size = 22; // macOS 메뉴바 아이콘 권장 크기
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext("2d");

  // 투명 배경
  ctx.clearRect(0, 0, size, size);

  // 텍스트 스타일 설정 (더 굵고 크게)
  ctx.fillStyle = "#000000";
  ctx.font = "900 16px -apple-system, BlinkMacSystemFont, sans-serif"; // 900 = extra bold
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // "CF" 텍스트 그리기
  ctx.fillText("CF", size / 2, size / 2 + 1); // 약간 아래로 조정

  // Canvas를 이미지로 변환
  const icon = nativeImage.createFromBuffer(canvas.toBuffer());
  icon.setTemplateImage(true); // macOS 템플릿 이미지로 설정

  tray = new Tray(icon);
  tray.setToolTip("Cloud Font Agent");

  // 오른쪽 클릭 메뉴 생성
  const contextMenu = Menu.buildFromTemplate([
    {
      label: "열기",
      click: () => {
        showWindow();
      },
    },
    {
      type: "separator",
    },
    {
      label: "종료",
      click: () => {
        app.quit();
      },
    },
  ]);

  console.log("Tray created successfully");

  // 왼쪽 클릭: 위젯 토글
  tray.on("click", () => {
    console.log("Tray clicked");
    toggleWindow();
  });

  // 오른쪽 클릭: 메뉴 표시
  tray.on("right-click", () => {
    console.log("Tray right-clicked");
    tray!.popUpContextMenu(contextMenu);
  });
}

function toggleWindow() {
  if (!mainWindow) {
    createWindow();
  }

  if (mainWindow!.isVisible()) {
    mainWindow!.hide();
  } else {
    showWindow();
  }
}

function showWindow() {
  if (!mainWindow) return;

  const trayBounds = tray!.getBounds();
  const windowBounds = mainWindow.getBounds();
  const { width: screenWidth } = screen.getPrimaryDisplay().workAreaSize;

  // 위젯의 왼쪽 끝을 트레이 아이콘의 왼쪽 끝에 정렬
  const x = Math.round(trayBounds.x);
  const y = Math.round(trayBounds.y + trayBounds.height + 4);

  // 화면 밖으로 나가지 않도록 조정
  const adjustedX = Math.min(Math.max(x, 0), screenWidth - windowBounds.width);

  mainWindow.setPosition(adjustedX, y, false);
  mainWindow.show();
  mainWindow.focus();
}

app.dock?.hide(); // Dock에서 앱 아이콘 숨기기

// Task 3.5: IPC Handlers
// Requirement 1.1, 6.1: IPC communication between main and renderer

/**
 * Setup IPC handlers for font operations
 */
function setupIpcHandlers() {
  // Handler: auth:login
  // Requirement 10.1: Authenticate user
  // Requirement 10.2: Handle invalid credentials
  ipcMain.handle(
    "auth:login",
    async (_event, email: string, password: string) => {
      try {
        if (!authManager) {
          throw new Error("Auth manager not initialized");
        }

        const result = await authManager.login(email, password);

        // If login successful, navigate to main app
        if (result.success && mainWindow) {
          mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));
        }

        return result;
      } catch (error) {
        console.error("Failed to login:", error);
        return {
          success: false,
          error: "로그인 중 오류가 발생했습니다.",
        };
      }
    }
  );

  // Handler: auth:logout
  ipcMain.handle("auth:logout", async () => {
    try {
      if (!authManager) {
        throw new Error("Auth manager not initialized");
      }

      await authManager.logout();

      // Navigate back to login page
      if (mainWindow) {
        mainWindow.loadFile(path.join(__dirname, "../renderer/login.html"));
      }

      return { success: true };
    } catch (error) {
      console.error("Failed to logout:", error);
      throw error;
    }
  });

  // Handler: auth:check
  ipcMain.handle("auth:check", async () => {
    try {
      if (!authManager) {
        throw new Error("Auth manager not initialized");
      }

      return {
        isAuthenticated: authManager.isAuthenticated(),
        user: authManager.getCurrentUser(),
      };
    } catch (error) {
      console.error("Failed to check auth:", error);
      throw error;
    }
  });

  // Handler: fonts:fetch
  // Requirement 1.1: Fetch purchased fonts from API
  ipcMain.handle("fonts:fetch", async () => {
    try {
      if (!apiClient) {
        throw new Error("API client not initialized");
      }
      const fonts = await apiClient.fetchPurchasedFonts();
      return fonts;
    } catch (error) {
      console.error("Failed to fetch fonts:", error);
      throw error;
    }
  });

  // Handler: fonts:registered
  // Get list of registered fonts
  ipcMain.handle("fonts:registered", async () => {
    try {
      if (!fontManager) {
        throw new Error("Font manager not initialized");
      }
      return fontManager.getRegisteredFonts();
    } catch (error) {
      console.error("Failed to get registered fonts:", error);
      throw error;
    }
  });

  // Handler: fonts:sync
  // Requirement 2.1: Start synchronization
  ipcMain.handle("fonts:sync", async () => {
    try {
      if (!syncManager || !apiClient) {
        throw new Error("Sync manager or API client not initialized");
      }

      // Fetch fonts to sync
      const fonts = await apiClient.fetchPurchasedFonts();

      // Start synchronization
      const result = await syncManager.syncAllFonts(fonts);

      return result;
    } catch (error) {
      console.error("Failed to sync fonts:", error);
      throw error;
    }
  });

  // Handler: fonts:register
  // Requirement 4.2: Register individual font
  ipcMain.handle(
    "fonts:register",
    async (_event, fontId: string, downloadUrl: string, fontName: string) => {
      try {
        if (!fontManager) {
          throw new Error("Font manager not initialized");
        }

        console.log(`Registering font: ${fontName} (${fontId})`);

        // Check if already registered
        if (fontManager.isFontRegistered(fontId)) {
          console.log(`Font already registered: ${fontName}`);
          return { success: true, message: "Font already registered" };
        }

        let fontData: Buffer;
        let extension: string;

        // Check if downloadUrl is a local file or remote URL
        if (downloadUrl.startsWith("file://")) {
          // Local file: read directly from filesystem
          const localFilePath = downloadUrl.replace("file://", "");
          console.log(`Reading local font file: ${localFilePath}`);

          fontData = await fs.promises.readFile(localFilePath);
          extension = path.extname(localFilePath).toLowerCase();
        } else {
          // Remote URL: download via HTTP
          console.log(`Downloading font from: ${downloadUrl}`);

          const response = await axios.get(downloadUrl, {
            responseType: "arraybuffer",
            timeout: 60000,
          });

          fontData = Buffer.from(response.data);

          // Determine file extension from URL
          const urlExt = path.extname(downloadUrl).toLowerCase();
          extension = [".ttf", ".otf"].includes(urlExt) ? urlExt : ".ttf";
        }

        // Validate extension
        if (![".ttf", ".otf"].includes(extension)) {
          throw new Error(`Unsupported font format: ${extension}`);
        }

        // Generate secure filename in cache directory
        const cacheFilePath = fontManager.getSecureFilePath(fontId, extension);

        // Write font data to cache directory
        await fs.promises.writeFile(cacheFilePath, fontData);
        console.log(`Font file cached at: ${cacheFilePath}`);

        // Register font with system
        await fontManager.registerFont(cacheFilePath, fontName);

        console.log(`Font registered successfully: ${fontName}`);
        return { success: true, message: "Font registered successfully" };
      } catch (error) {
        console.error(`Failed to register font ${fontName}:`, error);
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        return { success: false, error: errorMessage };
      }
    }
  );

  // Handler: fonts:unregister
  // Requirement 4.3: Unregister individual font
  ipcMain.handle("fonts:unregister", async (_event, fontId: string) => {
    try {
      if (!fontManager) {
        throw new Error("Font manager not initialized");
      }

      console.log(`Unregistering font: ${fontId}`);

      // Check if font is registered
      if (!fontManager.isFontRegistered(fontId)) {
        console.log(`Font not registered: ${fontId}`);
        return { success: true, message: "Font not registered" };
      }

      // Unregister font
      await fontManager.unregisterFont(fontId);

      console.log(`Font unregistered successfully: ${fontId}`);
      return { success: true, message: "Font unregistered successfully" };
    } catch (error) {
      console.error(`Failed to unregister font ${fontId}:`, error);
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      return { success: false, error: errorMessage };
    }
  });

  // Handler: window:minimize
  // Minimize the window
  ipcMain.on("window:minimize", () => {
    if (mainWindow) {
      mainWindow.minimize();
    }
  });

  // Handler: window:maximize
  // Maximize/restore the window
  ipcMain.on("window:maximize", () => {
    if (mainWindow) {
      if (mainWindow.isMaximized()) {
        mainWindow.restore();
      } else {
        mainWindow.maximize();
      }
    }
  });

  console.log("IPC handlers registered");
}

app.on("ready", async () => {
  console.log("App ready");

  // Initialize AuthManager
  // Requirement 10.5: Store authentication tokens securely
  authManager = new AuthManager();
  await authManager.initialize();

  // Initialize FontManager
  // Requirement 7.1: Create Font Cache Directory
  fontManager = new FontManager();
  await fontManager.initialize();

  // Initialize API Client
  // Task 3.2: Mock API Client
  apiClient = new FontAPIClient();

  createTray();
  createWindow();

  // Initialize SyncManager after window is created
  // Task 3.4: SyncManager implementation
  if (mainWindow) {
    syncManager = new SyncManager(fontManager, mainWindow);
  }

  // Setup IPC handlers
  // Task 3.5: IPC handler implementation
  setupIpcHandlers();
});

app.on("window-all-closed", (e: Event) => {
  e.preventDefault();
});

// Requirement 5.5 & Task 3.1: before-quit event handler for cleanup
// Requirements 4.1, 4.2, 4.3: Cleanup fonts on app quit
app.on("before-quit", async () => {
  console.log("App is quitting...");

  // Task 3.3: Call FontManager cleanup
  // Requirement 4.1: Unregister all fonts
  // Requirement 4.2: Delete all font files
  // Requirement 4.3: Empty cache directory
  if (fontManager) {
    await fontManager.cleanup();
  }
});
