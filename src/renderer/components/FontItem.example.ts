/**
 * FontItem Component Example
 * FontItem 컴포넌트 사용 예제
 */

import { FontItem } from "./FontItem";
import { Font } from "../../types/ui";

// Example font data
const exampleFonts: Font[] = [
  {
    id: "font-1",
    name: "Pretendard",
    version: "1.3.6",
    providerId: "taengtype",
    providerNameKo: "탱타입",
    providerNameEn: "Taengtype",
    enabled: false,
    downloadUrl: "https://example.com/pretendard.zip",
    license: "OFL",
    fileSize: 1024000,
  },
  {
    id: "font-2",
    name: "Gmarket Sans",
    version: "2.0.0",
    providerId: "eighttype",
    providerNameKo: "에잇타입",
    providerNameEn: "eighttype",
    enabled: true,
    downloadUrl: "https://example.com/gmarket.zip",
    license: "OFL",
    fileSize: 2048000,
  },
  {
    id: "font-3",
    name: "Noto Sans KR",
    version: "3.1.0",
    providerId: "google",
    providerNameKo: "구글",
    providerNameEn: "Google",
    enabled: false,
    downloadUrl: "https://example.com/noto.zip",
    license: "OFL",
    fileSize: 3072000,
  },
];

/**
 * FontItem 컴포넌트 예제 초기화
 */
export function initFontItemExample(): void {
  const container = document.getElementById("font-item-examples");
  if (!container) {
    console.error("Container element not found");
    return;
  }

  // Clear container
  container.innerHTML = "";

  // Create title
  const title = document.createElement("h2");
  title.textContent = "FontItem Component Examples";
  title.style.marginBottom = "24px";
  container.appendChild(title);

  // Create font items
  exampleFonts.forEach((font) => {
    const fontItem = new FontItem({
      font: font,
      onToggle: (enabled) => {
        console.log(`Font "${font.name}" ${enabled ? "enabled" : "disabled"}`);
        // Update font state
        font.enabled = enabled;
      },
      onInfoClick: () => {
        console.log(`Show info for font: ${font.name}`);
        alert(
          `Font Info:\n\nName: ${font.name}\nVersion: ${
            font.version
          }\nProvider: ${font.providerNameKo}\nLicense: ${
            font.license
          }\nSize: ${(font.fileSize / 1024).toFixed(0)} KB`
        );
      },
    });

    fontItem.mount(container);

    // Add spacing
    const spacer = document.createElement("div");
    spacer.style.height = "12px";
    container.appendChild(spacer);
  });

  // Add programmatic control example
  const controlSection = document.createElement("div");
  controlSection.style.marginTop = "32px";
  controlSection.style.padding = "16px";
  controlSection.style.background = "#f5f5f7";
  controlSection.style.borderRadius = "8px";

  const controlTitle = document.createElement("h3");
  controlTitle.textContent = "Programmatic Control";
  controlTitle.style.marginBottom = "12px";
  controlSection.appendChild(controlTitle);

  const enableAllBtn = document.createElement("button");
  enableAllBtn.textContent = "Enable All Fonts";
  enableAllBtn.className = "btn btn--primary";
  enableAllBtn.style.marginRight = "8px";
  enableAllBtn.onclick = () => {
    exampleFonts.forEach((font) => {
      font.enabled = true;
    });
    // Re-render
    initFontItemExample();
  };

  const disableAllBtn = document.createElement("button");
  disableAllBtn.textContent = "Disable All Fonts";
  disableAllBtn.className = "btn btn--secondary";
  disableAllBtn.onclick = () => {
    exampleFonts.forEach((font) => {
      font.enabled = false;
    });
    // Re-render
    initFontItemExample();
  };

  controlSection.appendChild(enableAllBtn);
  controlSection.appendChild(disableAllBtn);
  container.appendChild(controlSection);
}

// Auto-initialize if DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initFontItemExample);
} else {
  initFontItemExample();
}
