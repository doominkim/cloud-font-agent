/**
 * SVG Icon Utilities
 * Provides SVG icons for the application
 * Requirements: 1.1, 2.3, 5.1
 */

export type IconName =
  | "home"
  | "message"
  | "cloud"
  | "settings"
  | "search"
  | "info"
  | "close"
  | "chevron-down"
  | "chevron-right";

/**
 * Create an SVG icon element
 */
export function createIcon(
  name: IconName,
  className: string = ""
): SVGSVGElement {
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "20");
  svg.setAttribute("height", "20");
  svg.setAttribute("viewBox", "0 0 20 20");
  svg.setAttribute("fill", "currentColor");
  if (className) {
    svg.setAttribute("class", className);
  }

  const path = getIconPath(name);
  const pathElement = document.createElementNS(
    "http://www.w3.org/2000/svg",
    "path"
  );
  pathElement.setAttribute("d", path);
  pathElement.setAttribute("fill-rule", "evenodd");
  pathElement.setAttribute("clip-rule", "evenodd");

  svg.appendChild(pathElement);
  return svg;
}

/**
 * Get SVG path data for an icon
 */
function getIconPath(name: IconName): string {
  const paths: Record<IconName, string> = {
    // Home icon - house shape
    home: "M10 3L2 9v9h5v-5h6v5h5V9l-8-6zm0 2.236L15 9v7h-2v-5H7v5H5V9l5-3.764z",

    // Message icon - chat bubble
    message:
      "M3 4a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2h-3.586l-2.707 2.707a1 1 0 01-1.414 0L4.586 14H5a2 2 0 01-2-2V4zm2 0v8h2a1 1 0 01.707.293L10 14.586l2.293-2.293A1 1 0 0113 12h2V4H5z",

    // Cloud icon - cloud shape
    cloud:
      "M5.5 8a4.5 4.5 0 019 0 3.5 3.5 0 011 6.872V15H4.5v-.128A3.5 3.5 0 015.5 8zm4.5-2.5a2.5 2.5 0 00-2.45 2.036l-.05.214-.214.05A1.5 1.5 0 006.5 10.5v2.5h7v-2.5a1.5 1.5 0 00-.786-1.318l-.214-.05-.05-.214A2.5 2.5 0 0010 5.5z",

    // Settings icon - gear
    settings:
      "M10 2a1 1 0 011 1v1.323a7.5 7.5 0 011.658.752l.935-.935a1 1 0 011.414 1.414l-.935.935A7.5 7.5 0 0114.677 8H16a1 1 0 110 2h-1.323a7.5 7.5 0 01-.752 1.658l.935.935a1 1 0 01-1.414 1.414l-.935-.935A7.5 7.5 0 0111 14.677V16a1 1 0 11-2 0v-1.323a7.5 7.5 0 01-1.658-.752l-.935.935a1 1 0 01-1.414-1.414l.935-.935A7.5 7.5 0 014.323 12H3a1 1 0 110-2h1.323a7.5 7.5 0 01.752-1.658l-.935-.935a1 1 0 011.414-1.414l.935.935A7.5 7.5 0 018 5.323V4a1 1 0 011-1zm0 5a3 3 0 100 6 3 3 0 000-6z",

    // Search icon - magnifying glass
    search:
      "M8 2a6 6 0 104.472 10.025l3.751 3.752a1 1 0 001.414-1.414l-3.752-3.751A6 6 0 008 2zM4 8a4 4 0 118 0 4 4 0 01-8 0z",

    // Info icon - circle with i
    info: "M10 2a8 8 0 100 16 8 8 0 000-16zm0 2a6 6 0 110 12 6 6 0 010-12zm0 2a1 1 0 00-1 1v5a1 1 0 102 0V7a1 1 0 00-1-1zm0 7a1 1 0 100 2 1 1 0 000-2z",

    // Close icon - X
    close:
      "M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z",

    // Chevron down - for expanded state
    "chevron-down":
      "M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z",

    // Chevron right - for collapsed state
    "chevron-right":
      "M7.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L10.586 10 7.293 6.707a1 1 0 010-1.414z",
  };

  return paths[name] || "";
}

/**
 * Get icon as HTML string (for innerHTML)
 */
export function getIconHTML(name: IconName, className: string = ""): string {
  const path = getIconPath(name);
  const classAttr = className ? ` class="${className}"` : "";

  return `<svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor"${classAttr} xmlns="http://www.w3.org/2000/svg">
    <path fill-rule="evenodd" clip-rule="evenodd" d="${path}" />
  </svg>`;
}
