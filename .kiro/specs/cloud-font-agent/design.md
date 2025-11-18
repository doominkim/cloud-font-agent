# Design Document

## Overview

Cloud Font Agent는 위젯 형태의 Electron 기반 데스크톱 애플리케이션으로, 사용자가 결제한 폰트를 웹 API로부터 조회하고 동기화 버튼을 통해 일괄 다운로드하여 macOS 시스템에서 임시로 사용할 수 있게 합니다. Native Module을 통해 macOS의 CTFontManager API를 활용하여 폰트를 동적으로 관리하며, 프로세스 수명 동안만 폰트를 활성화하여 저작권을 보호합니다.

## Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────┐
│              Electron Widget App (400x600)              │
│  ┌────────────────┐              ┌──────────────────┐   │
│  │   Renderer     │◄────IPC─────►│  Main Process    │   │
│  │   (Widget UI)  │              │                  │   │
│  │  - Font List   │              │  - API Client    │   │
│  │  - Sync Button │              │  - Font Manager  │   │
│  └────────────────┘              │  - Download Mgr  │   │
│                                   └────────┬─────────┘   │
│                                            │             │
└────────────────────────────────────────────┼─────────────┘
                                             │
                    ┌────────────────────────┼────────────────────┐
                    │                        │                    │
                    ▼                        ▼                    ▼
         ┌──────────────────┐   ┌──────────────────┐  ┌─────────────────┐
         │  Font API Server │   │  Native Module   │  │  Font Files     │
         │  (Mock for MVP)  │   │  - registerFont  │  │  (Temp Cache)   │
         │                  │   │  - unregisterFont│  │                 │
         │  GET /fonts      │   │  - CTFontManager │  │  ~/.cloud-font- │
         │  GET /download   │   │    Wrapper       │  │   agent/.cache/ │
         └──────────────────┘   └────────┬─────────┘  └─────────────────┘
                                         │
                                         ▼
                            ┌──────────────────────────┐
                            │   macOS CTFontManager    │
                            │   System Font Registry   │
                            └──────────────────────────┘
```

### Technology Stack

- **Frontend**: Electron + HTML/CSS/JavaScript (바닐라, React 제외)
- **Backend**: Node.js (Electron Main Process)
- **Native Module**: Objective-C++ + node-gyp
- **Build Tool**: electron-builder
- **IPC**: Electron IPC (ipcMain/ipcRenderer)
- **API Client**: axios 또는 node-fetch

## Components and Interfaces

### 1. Electron Main Process Components

#### FontAPIClient

Font API Server와 통신하는 컴포넌트입니다.

```typescript
interface PurchasedFont {
  id: string;
  name: string;
  downloadUrl: string;
  fileSize: number;
}

interface FontAPIClient {
  /**
   * 사용자가 결제한 폰트 목록을 조회합니다
   * @returns 결제한 폰트 목록
   */
  fetchPurchasedFonts(): Promise<PurchasedFont[]>;

  /**
   * 폰트 파일을 다운로드합니다
   * @param url - 폰트 다운로드 URL
   * @param destPath - 저장할 로컬 경로
   * @returns 다운로드 성공 여부
   */
  downloadFontFile(url: string, destPath: string): Promise<boolean>;
}
```

**구현 세부사항 (MVP - Mock API):**

- 하드코딩된 폰트 목록 반환
- 공개 폰트 URL 사용 (Google Fonts, GitHub 등)
- 실제 HTTP 다운로드 수행

**Mock 데이터 예시:**

```typescript
const MOCK_FONTS: PurchasedFont[] = [
  {
    id: "1",
    name: "Noto Sans KR",
    downloadUrl:
      "https://github.com/notofonts/noto-cjk/raw/main/Sans/OTF/Korean/NotoSansKR-Regular.otf",
    fileSize: 2500000,
  },
  {
    id: "2",
    name: "Roboto",
    downloadUrl:
      "https://github.com/google/roboto/raw/main/src/hinted/Roboto-Regular.ttf",
    fileSize: 168000,
  },
  {
    id: "3",
    name: "Open Sans",
    downloadUrl:
      "https://github.com/googlefonts/opensans/raw/main/fonts/ttf/OpenSans-Regular.ttf",
    fileSize: 217000,
  },
];
```

#### SyncManager

폰트 동기화를 관리하는 컴포넌트입니다.

```typescript
interface SyncProgress {
  total: number;
  completed: number;
  current: string;
  percentage: number;
}

interface SyncManager {
  /**
   * 모든 폰트를 동기화합니다 (다운로드 + 등록)
   * @param fonts - 동기화할 폰트 목록
   * @returns 동기화 결과
   */
  syncAllFonts(fonts: PurchasedFont[]): Promise<SyncResult>;

  /**
   * 동기화 진행 상황을 반환합니다
   */
  getSyncProgress(): SyncProgress;

  /**
   * 동기화를 취소합니다
   */
  cancelSync(): void;
}

interface SyncResult {
  success: number;
  failed: number;
  errors: Array<{ fontName: string; error: string }>;
}
```

**구현 세부사항:**

- 순차적으로 폰트 다운로드 (병렬 제한)
- 다운로드 완료 후 즉시 등록
- 진행률을 Renderer에 실시간 전송
- 일부 실패해도 계속 진행

#### FontManager

폰트 등록/해제를 관리하는 컴포넌트입니다.

```typescript
interface RegisteredFont {
  id: string;
  name: string;
  filePath: string;
  registeredAt: Date;
  isActive: boolean;
}

interface FontManager {
  /**
   * 폰트를 시스템에 등록합니다
   * @param filePath - 폰트 파일 경로
   * @param fontName - 폰트 이름
   * @returns 등록된 폰트 정보
   */
  registerFont(filePath: string, fontName: string): Promise<RegisteredFont>;

  /**
   * 등록된 모든 폰트 목록을 반환합니다
   */
  getRegisteredFonts(): RegisteredFont[];

  /**
   * 모든 폰트를 해제하고 파일을 삭제합니다
   */
  cleanup(): Promise<void>;
}
```

**구현 세부사항:**

- Native Module 호출
- 폰트 상태를 메모리에 유지 (Map<fontId, RegisteredFont>)
- 앱 종료 시 `cleanup()` 자동 호출
- Font Cache Directory: `~/.cloud-font-agent/.cache/`

#### AppLifecycleManager

애플리케이션 생명주기를 관리합니다.

```typescript
interface AppLifecycleManager {
  /**
   * 앱 시작 시 초기화 작업을 수행합니다
   */
  initialize(): Promise<void>;

  /**
   * 앱 종료 시 정리 작업을 수행합니다
   */
  shutdown(): Promise<void>;
}
```

**구현 세부사항:**

- `app.on('before-quit')` 이벤트에서 `FontManager.cleanup()` 호출
- Font Cache Directory 생성 및 정리
- 위젯 창 설정 (크기, 항상 위)

### 2. Native Module (Objective-C++)

#### FontBridge

Electron에서 호출 가능한 Native 인터페이스입니다.

```cpp
// native/font_bridge.mm
#import <CoreText/CoreText.h>
#import <Foundation/Foundation.h>

// Node.js에서 호출 가능한 함수들
Napi::Value RegisterFont(const Napi::CallbackInfo& info);
Napi::Value UnregisterFont(const Napi::CallbackInfo& info);
Napi::Value UnregisterAllFonts(const Napi::CallbackInfo& info);
```

**구현 세부사항:**

- `CTFontManagerRegisterFontsForURL` 사용 (scope: `kCTFontManagerScopeProcess`)
- `CTFontManagerUnregisterFontsForURL` 사용
- 에러 처리 및 결과 반환
- 등록된 폰트 URL 추적

### 3. Renderer Process (Widget UI)

#### Widget Window 설정

```typescript
// Main Process에서 BrowserWindow 생성
const widgetWindow = new BrowserWindow({
  width: 400,
  height: 600,
  alwaysOnTop: true,
  resizable: false,
  frame: true,
  webPreferences: {
    preload: path.join(__dirname, "preload.js"),
    contextIsolation: true,
    nodeIntegration: false,
  },
});
```

#### UI 구조

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Cloud Font Agent</title>
    <style>
      body {
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        margin: 0;
        padding: 20px;
        background: #f5f5f5;
      }
      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 20px;
      }
      .sync-button {
        padding: 10px 20px;
        background: #007aff;
        color: white;
        border: none;
        border-radius: 6px;
        cursor: pointer;
      }
      .sync-button:disabled {
        background: #ccc;
        cursor: not-allowed;
      }
      .font-list {
        list-style: none;
        padding: 0;
      }
      .font-item {
        background: white;
        padding: 15px;
        margin-bottom: 10px;
        border-radius: 6px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      }
      .font-status {
        font-size: 12px;
        color: #666;
      }
      .font-status.synced {
        color: #34c759;
      }
      .progress-bar {
        width: 100%;
        height: 4px;
        background: #e0e0e0;
        border-radius: 2px;
        overflow: hidden;
        margin-top: 10px;
      }
      .progress-fill {
        height: 100%;
        background: #007aff;
        transition: width 0.3s;
      }
    </style>
  </head>
  <body>
    <div class="header">
      <h2>내 폰트</h2>
      <button id="syncButton" class="sync-button">동기화</button>
    </div>

    <div id="progressContainer" style="display: none;">
      <div class="progress-bar">
        <div id="progressFill" class="progress-fill" style="width: 0%"></div>
      </div>
      <p
        id="progressText"
        style="text-align: center; margin-top: 5px; font-size: 12px;"
      ></p>
    </div>

    <ul id="fontList" class="font-list"></ul>

    <script src="renderer.js"></script>
  </body>
</html>
```

#### Renderer Logic

```javascript
// renderer.js
let fonts = [];
let registeredFonts = [];

// 초기 로드
async function loadFonts() {
  fonts = await window.fontAPI.fetchFonts();
  registeredFonts = await window.fontAPI.getRegisteredFonts();
  renderFontList();
}

// 폰트 목록 렌더링
function renderFontList() {
  const fontList = document.getElementById("fontList");
  fontList.innerHTML = "";

  fonts.forEach((font) => {
    const isRegistered = registeredFonts.some((rf) => rf.name === font.name);
    const li = document.createElement("li");
    li.className = "font-item";
    li.innerHTML = `
      <div>
        <div style="font-weight: 500;">${font.name}</div>
        <div class="font-status ${isRegistered ? "synced" : ""}">
          ${isRegistered ? "✓ 동기화됨" : "동기화 필요"}
        </div>
      </div>
      <div style="font-size: 12px; color: #999;">
        ${(font.fileSize / 1024 / 1024).toFixed(2)} MB
      </div>
    `;
    fontList.appendChild(li);
  });
}

// 동기화 버튼 클릭
document.getElementById("syncButton").addEventListener("click", async () => {
  const button = document.getElementById("syncButton");
  const progressContainer = document.getElementById("progressContainer");

  button.disabled = true;
  progressContainer.style.display = "block";

  try {
    await window.fontAPI.syncFonts();
    await loadFonts();
  } catch (error) {
    alert("동기화 실패: " + error.message);
  } finally {
    button.disabled = false;
    progressContainer.style.display = "none";
  }
});

// 진행률 업데이트 리스너
window.fontAPI.onSyncProgress((progress) => {
  const fill = document.getElementById("progressFill");
  const text = document.getElementById("progressText");

  fill.style.width = progress.percentage + "%";
  text.textContent = `${progress.current} (${progress.completed}/${progress.total})`;
});

// 초기 로드
loadFonts();
```

## Data Models

### PurchasedFont (API Response)

```typescript
interface PurchasedFont {
  id: string; // 폰트 ID
  name: string; // 폰트 이름
  downloadUrl: string; // 다운로드 URL
  fileSize: number; // 파일 크기 (bytes)
}
```

### RegisteredFont (Local State)

```typescript
interface RegisteredFont {
  id: string; // UUID
  name: string; // 폰트 이름
  filePath: string; // 로컬 파일 경로
  registeredAt: Date; // 등록 시간
  isActive: boolean; // 활성화 상태
}
```

### SyncProgress

```typescript
interface SyncProgress {
  total: number; // 전체 폰트 수
  completed: number; // 완료된 폰트 수
  current: string; // 현재 처리 중인 폰트 이름
  percentage: number; // 진행률 (0-100)
}
```

## IPC Communication Protocol

### Main → Renderer Events

```typescript
// 동기화 진행률 업데이트
ipcRenderer.on("sync:progress", (event, progress: SyncProgress) => {});

// 에러 발생
ipcRenderer.on("error", (event, error: { message: string }) => {});
```

### Renderer → Main Invocations

```typescript
// 폰트 목록 조회
ipcRenderer.invoke('fonts:fetch'): Promise<PurchasedFont[]>

// 등록된 폰트 목록 조회
ipcRenderer.invoke('fonts:registered'): Promise<RegisteredFont[]>

// 동기화 시작
ipcRenderer.invoke('fonts:sync'): Promise<SyncResult>
```

### Preload Script

```javascript
// preload.js
const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("fontAPI", {
  fetchFonts: () => ipcRenderer.invoke("fonts:fetch"),
  getRegisteredFonts: () => ipcRenderer.invoke("fonts:registered"),
  syncFonts: () => ipcRenderer.invoke("fonts:sync"),
  onSyncProgress: (callback) => {
    ipcRenderer.on("sync:progress", (event, progress) => callback(progress));
  },
});
```

## File System Structure

```
~/.cloud-font-agent/
└── .cache/                   # Font Cache Directory (권한: 0700)
    ├── {uuid}.ttf           # 다운로드한 폰트 파일 (권한: 0400)
    ├── {uuid}.otf
    └── ...

~/Library/Application Support/cloud-font-agent/
└── logs/                     # 로그 파일 (선택적)
    └── app.log
```

## Error Handling

### Error Types

```typescript
enum FontErrorCode {
  API_ERROR = "API_ERROR",
  DOWNLOAD_FAILED = "DOWNLOAD_FAILED",
  REGISTRATION_FAILED = "REGISTRATION_FAILED",
  NETWORK_ERROR = "NETWORK_ERROR",
}
```

### Error Handling Strategy

1. **API 조회 실패**: 에러 메시지 표시, 재시도 버튼 제공
2. **다운로드 실패**: 해당 폰트 건너뛰고 계속 진행
3. **등록 실패**: 다운로드한 파일 삭제, 에러 로그 기록
4. **부분 성공**: 성공한 폰트는 유지, 실패한 폰트만 표시

## Build and Deployment

### Development Setup

```bash
# 의존성 설치
npm install

# Native Module 빌드
npm run build:native

# Electron 개발 모드 실행
npm run dev
```

### Production Build

```bash
# 전체 빌드
npm run build

# macOS 앱 패키징
npm run package:mac

# 결과물: dist/Cloud Font Agent.app
```

### Native Module Build Configuration

```json
{
  "targets": [
    {
      "target_name": "font_bridge",
      "sources": ["native/font_bridge.mm"],
      "include_dirs": ["<!@(node -p \"require('node-addon-api').include\")"],
      "xcode_settings": {
        "OTHER_CFLAGS": ["-ObjC++", "-std=c++17"],
        "MACOSX_DEPLOYMENT_TARGET": "10.13"
      },
      "link_settings": {
        "libraries": ["-framework CoreText", "-framework Foundation"]
      },
      "defines": ["NAPI_DISABLE_CPP_EXCEPTIONS"]
    }
  ]
}
```

## Future Enhancements (Out of Scope for MVP)

- 실제 서버 API 연동
- 로그인/인증 (세션 기반)
- 폰트 암호화/복호화
- 개별 폰트 선택 동기화
- 폰트 미리보기
- 자동 동기화 (주기적)
- 사용 기한 관리
- 트레이 아이콘
