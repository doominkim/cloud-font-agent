/**
 * Header Component Usage Example
 *
 * This file demonstrates how to use the Header component
 */

import { Header } from "./Header";

// Example 1: Basic usage with default title
const header = new Header({
  title: "Kerning City",
});

// Mount to the app container
const appContainer = document.getElementById("app");
if (appContainer) {
  header.mount(appContainer);
}

// Example 2: Update title dynamically
header.update({
  title: "Cloud Font Agent",
});

// Example 3: Get the DOM element for custom manipulation
const headerElement = header.getElement();
console.log("Header element:", headerElement);

// Example 4: Cleanup when component is no longer needed
// header.destroy();
