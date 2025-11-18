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
import { FontManager } from "./font-manager";
import { SyncManager } from "./sync-manager";
import { FontAPIClient } from "./api-client";

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let fontManager: FontManager | null = null;
let syncManager: SyncManager | null = null;
let apiClient: FontAPIClient | null = null;

function createWindow() {
  // Requirements 5.1, 5.2, 5.3, 5.4, 5.5
  mainWindow = new BrowserWindow({
    width: 400, // Requirement 5.1: 400px width
    height: 600, // Requirement 5.1: 600px height
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

  mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));

  // Open DevTools for debugging (comment out in production)
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

  // macOS 메뉴바용 템플릿 아이콘 생성 (16x16, 검은색 픽셀)
  // Template 이미지는 자동으로 라이트/다크 모드에 맞춰 색상이 변경됨
  const size = 16;
  const canvas = Buffer.alloc(size * size * 4);

  // 간단한 'F' 모양 그리기
  const pixels = [
    [2, 2],
    [3, 2],
    [4, 2],
    [5, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [3, 5],
    [4, 5],
    [2, 6],
    [2, 7],
    [2, 8],
    [2, 9],
    [2, 10],
    [2, 11],
    [2, 12],
    [2, 13],
  ];

  pixels.forEach(([x, y]) => {
    const offset = (y * size + x) * 4;
    canvas[offset] = 0; // R
    canvas[offset + 1] = 0; // G
    canvas[offset + 2] = 0; // B
    canvas[offset + 3] = 255; // A
  });

  const icon = nativeImage.createFromBuffer(canvas, {
    width: size,
    height: size,
  });
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

  tray.setContextMenu(contextMenu);

  console.log("Tray created successfully");

  tray.on("click", () => {
    console.log("Tray clicked");
    toggleWindow();
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

  // 메뉴바 아이콘 위치에 따라 윈도우 위치 계산
  const x = Math.round(
    trayBounds.x - windowBounds.width / 2 + trayBounds.width / 2
  );
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

  console.log("IPC handlers registered");
}

app.on("ready", async () => {
  console.log("App ready");

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
