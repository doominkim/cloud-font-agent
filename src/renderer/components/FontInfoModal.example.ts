/**
 * FontInfoModal Component Example
 * 폰트 정보 모달 컴포넌트 사용 예제
 */

import { FontInfoModal } from "./FontInfoModal";
import { FontInfo } from "../../types/ui";

// Example 1: Basic usage
export function basicExample(): FontInfoModal {
  const fontInfo: FontInfo = {
    name: "Pretendard",
    version: "1.3.6",
    provider: "탱타입 (Taengtype)",
    license: "SIL Open Font License",
    fileSize: 2048576, // 2MB
    previewText: "가나다라마바사 ABCDEFG 1234567",
  };

  const modal = new FontInfoModal({
    fontInfo: fontInfo,
    onClose: () => {
      console.log("Modal closed");
    },
  });

  return modal;
}

// Example 2: With different font
export function differentFontExample(): FontInfoModal {
  const fontInfo: FontInfo = {
    name: "Sandoll 고딕Neo1",
    version: "2.0.1",
    provider: "eighttype",
    license: "Commercial License",
    fileSize: 3145728, // 3MB
    previewText: "The quick brown fox jumps over the lazy dog",
  };

  const modal = new FontInfoModal({
    fontInfo: fontInfo,
    onClose: () => {
      console.log("Different font modal closed");
    },
  });

  return modal;
}

// Example 3: With Korean preview text
export function koreanPreviewExample(): FontInfoModal {
  const fontInfo: FontInfo = {
    name: "나눔고딕",
    version: "1.0.0",
    provider: "활자도서관",
    license: "OFL (Open Font License)",
    fileSize: 1572864, // 1.5MB
    previewText: "다람쥐 헌 쳇바퀴에 타고파",
  };

  const modal = new FontInfoModal({
    fontInfo: fontInfo,
    onClose: () => {
      console.log("Korean preview modal closed");
    },
  });

  return modal;
}

// Example 4: Interactive demo
export function interactiveDemo(): void {
  const fontInfo: FontInfo = {
    name: "Pretendard",
    version: "1.3.6",
    provider: "탱타입 (Taengtype)",
    license: "SIL Open Font License",
    fileSize: 2048576,
    previewText: "가나다라마바사 ABCDEFG 1234567",
  };

  const modal = new FontInfoModal({
    fontInfo: fontInfo,
    onClose: () => {
      console.log("Modal closed by user");
    },
  });

  // Mount to body
  modal.mount(document.body);

  // Create a button to show the modal
  const button = document.createElement("button");
  button.textContent = "Show Font Info";
  button.className = "btn btn--primary";
  button.style.margin = "20px";
  button.addEventListener("click", () => {
    modal.show();
  });

  document.body.appendChild(button);
}

// Example 5: Multiple modals
export function multipleModalsExample(): void {
  const fonts: FontInfo[] = [
    {
      name: "Pretendard",
      version: "1.3.6",
      provider: "탱타입 (Taengtype)",
      license: "SIL Open Font License",
      fileSize: 2048576,
      previewText: "가나다라마바사",
    },
    {
      name: "Sandoll 고딕Neo1",
      version: "2.0.1",
      provider: "eighttype",
      license: "Commercial License",
      fileSize: 3145728,
      previewText: "ABCDEFG 1234567",
    },
    {
      name: "나눔고딕",
      version: "1.0.0",
      provider: "활자도서관",
      license: "OFL",
      fileSize: 1572864,
      previewText: "다람쥐 헌 쳇바퀴",
    },
  ];

  const container = document.createElement("div");
  container.style.padding = "20px";
  container.style.display = "flex";
  container.style.gap = "10px";

  fonts.forEach((fontInfo) => {
    const modal = new FontInfoModal({
      fontInfo: fontInfo,
      onClose: () => {
        console.log(`${fontInfo.name} modal closed`);
      },
    });

    modal.mount(document.body);

    const button = document.createElement("button");
    button.textContent = `Show ${fontInfo.name}`;
    button.className = "btn btn--secondary";
    button.addEventListener("click", () => {
      modal.show();
    });

    container.appendChild(button);
  });

  document.body.appendChild(container);
}
