import { app, BrowserWindow, Tray, screen, nativeImage, Menu } from "electron";
import * as path from "path";

let mainWindow: BrowserWindow | null = null;
let tray: Tray | null = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 400,
    height: 600,
    show: false,
    frame: false,
    resizable: false,
    transparent: false,
    skipTaskbar: true,
    alwaysOnTop: true,
    webPreferences: {
      preload: path.join(__dirname, "../renderer/preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow.loadFile(path.join(__dirname, "../renderer/index.html"));

  mainWindow.on("blur", () => {
    if (mainWindow && !mainWindow.webContents.isDevToolsOpened()) {
      mainWindow.hide();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
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

app.on("ready", () => {
  console.log("App ready");
  createTray();
  createWindow();
});

app.on("window-all-closed", (e: Event) => {
  e.preventDefault();
});

app.on("before-quit", async () => {
  console.log("App is quitting...");
});
