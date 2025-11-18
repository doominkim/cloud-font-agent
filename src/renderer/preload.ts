import { contextBridge, ipcRenderer } from "electron";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("fontAPI", {
  // Will be implemented in later tasks
  fetchFonts: () => ipcRenderer.invoke("fonts:fetch"),
  getRegisteredFonts: () => ipcRenderer.invoke("fonts:registered"),
  syncFonts: () => ipcRenderer.invoke("fonts:sync"),
  onSyncProgress: (callback: (progress: any) => void) => {
    ipcRenderer.on("sync:progress", (event, progress) => callback(progress));
  },
});
