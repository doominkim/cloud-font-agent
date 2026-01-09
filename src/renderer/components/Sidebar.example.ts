/**
 * Sidebar Component Usage Example
 *
 * This file demonstrates how to use the Sidebar component
 */

import { Sidebar } from "./Sidebar";
import { NavigationItem } from "../../types/ui";

// Example: Create a sidebar with navigation items
function createSidebarExample() {
  const navigationItems: NavigationItem[] = [
    {
      id: "home",
      icon: "🏠",
      label: "Home",
      active: true,
    },
    {
      id: "messages",
      icon: "💬",
      label: "Messages",
      active: false,
    },
    {
      id: "cloud",
      icon: "☁️",
      label: "Cloud Sync",
      active: false,
    },
  ];

  const sidebar = new Sidebar({
    items: navigationItems,
    onNavigate: (itemId: string) => {
      console.log(`Navigated to: ${itemId}`);

      // Handle navigation based on itemId
      switch (itemId) {
        case "home":
          // Show font list
          console.log("Showing font list");
          break;
        case "messages":
          // Show messages/notifications
          console.log("Showing messages");
          break;
        case "cloud":
          // Show sync status
          console.log("Showing cloud sync status");
          break;
        case "settings":
          // Show settings
          console.log("Showing settings");
          break;
      }
    },
  });

  return sidebar;
}

// Example: Mount the sidebar to the DOM
function mountSidebarExample() {
  const sidebar = createSidebarExample();
  const container = document.querySelector(".main-layout") as HTMLElement;

  if (container) {
    sidebar.mount(container);
  }
}

// Example: Programmatically change active item
function changeActiveItemExample() {
  const sidebar = createSidebarExample();

  // Change to messages after 2 seconds
  setTimeout(() => {
    sidebar.setActive("messages");
  }, 2000);

  return sidebar;
}

// Export examples
export { createSidebarExample, mountSidebarExample, changeActiveItemExample };
