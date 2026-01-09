/**
 * ProviderGroup Component Example
 *
 * This file demonstrates how to use the ProviderGroup component
 */

import { ProviderGroup } from "./ProviderGroup";
import { Provider, Font } from "../../types/ui";

// Example provider data
const exampleProvider: Provider = {
  id: "taengtype",
  nameKo: "탱타입",
  nameEn: "Taengtype",
};

// Example font data
const exampleFonts: Font[] = [
  {
    id: "font1",
    name: "탱타입 고딕",
    version: "1.0.0",
    providerId: "taengtype",
    providerNameKo: "탱타입",
    providerNameEn: "Taengtype",
    enabled: false,
    downloadUrl: "https://example.com/font1",
    license: "OFL",
    fileSize: 1024000,
  },
  {
    id: "font2",
    name: "탱타입 명조",
    version: "2.1.0",
    providerId: "taengtype",
    providerNameKo: "탱타입",
    providerNameEn: "Taengtype",
    enabled: true,
    downloadUrl: "https://example.com/font2",
    license: "OFL",
    fileSize: 2048000,
  },
  {
    id: "font3",
    name: "탱타입 라운드",
    version: "1.5.0",
    providerId: "taengtype",
    providerNameKo: "탱타입",
    providerNameEn: "Taengtype",
    enabled: false,
    downloadUrl: "https://example.com/font3",
    license: "OFL",
    fileSize: 1536000,
  },
];

// Example 1: Basic usage
export function createBasicProviderGroup(): ProviderGroup {
  return new ProviderGroup({
    provider: exampleProvider,
    fonts: exampleFonts,
    collapsed: false,
    onToggleCollapse: () => {
      console.log("Provider group toggled");
    },
    onFontToggle: (fontId: string, enabled: boolean) => {
      console.log(`Font ${fontId} toggled to ${enabled}`);
    },
    onInfoClick: (fontId: string) => {
      console.log(`Info clicked for font ${fontId}`);
    },
  });
}

// Example 2: Collapsed provider group
export function createCollapsedProviderGroup(): ProviderGroup {
  return new ProviderGroup({
    provider: exampleProvider,
    fonts: exampleFonts,
    collapsed: true,
    onToggleCollapse: () => {
      console.log("Provider group toggled");
    },
    onFontToggle: (fontId: string, enabled: boolean) => {
      console.log(`Font ${fontId} toggled to ${enabled}`);
    },
    onInfoClick: (fontId: string) => {
      console.log(`Info clicked for font ${fontId}`);
    },
  });
}

// Example 3: Provider group with state management
export function createStatefulProviderGroup(): ProviderGroup {
  let isCollapsed = false;

  const providerGroup = new ProviderGroup({
    provider: exampleProvider,
    fonts: exampleFonts,
    collapsed: isCollapsed,
    onToggleCollapse: () => {
      isCollapsed = !isCollapsed;
      if (isCollapsed) {
        providerGroup.collapse();
      } else {
        providerGroup.expand();
      }
      console.log(
        `Provider group is now ${isCollapsed ? "collapsed" : "expanded"}`
      );
    },
    onFontToggle: (fontId: string, enabled: boolean) => {
      console.log(`Font ${fontId} toggled to ${enabled}`);
      // Update font state in your data store
    },
    onInfoClick: (fontId: string) => {
      console.log(`Info clicked for font ${fontId}`);
      // Show font info modal
    },
  });

  return providerGroup;
}

// Example 4: Multiple provider groups
export function createMultipleProviderGroups(): ProviderGroup[] {
  const providers = [
    { id: "taengtype", nameKo: "탱타입", nameEn: "Taengtype" },
    { id: "eighttype", nameKo: "에잇타입", nameEn: "eighttype" },
    { id: "fontlibrary", nameKo: "활자도서관", nameEn: "Font Library" },
  ];

  return providers.map((provider) => {
    return new ProviderGroup({
      provider,
      fonts: exampleFonts.map((font) => ({
        ...font,
        providerId: provider.id,
        providerNameKo: provider.nameKo,
        providerNameEn: provider.nameEn,
      })),
      collapsed: false,
      onToggleCollapse: () => {
        console.log(`${provider.nameKo} toggled`);
      },
      onFontToggle: (fontId: string, enabled: boolean) => {
        console.log(
          `Font ${fontId} in ${provider.nameKo} toggled to ${enabled}`
        );
      },
      onInfoClick: (fontId: string) => {
        console.log(`Info clicked for font ${fontId} in ${provider.nameKo}`);
      },
    });
  });
}
