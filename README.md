# Cloud Font Agent

Widget for managing purchased fonts on macOS.

## Setup

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build:ts

# Build native module
npm run build:native

# Run in development mode
npm run dev
```

## Project Structure

```
cloud-font-agent/
├── src/
│   ├── main/           # Electron main process
│   └── renderer/       # Electron renderer process (UI)
├── native/             # Native Objective-C++ module
├── dist/               # Compiled output
└── build/              # Native module build artifacts
```

## Requirements

- macOS 10.13 or later
- Node.js 18+
- Xcode Command Line Tools
