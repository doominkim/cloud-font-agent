/**
 * ProviderGroup Component
 * 폰트 제공업체별 그룹을 표시하고 접기/펼치기 기능을 제공하는 컴포넌트
 */

import { Component } from "./base/Component";
import { ProviderGroupProps } from "../../types/ui";
import { FontItem } from "./FontItem";
import { createIcon } from "../utils/icons";

export class ProviderGroup extends Component<ProviderGroupProps> {
  private header: HTMLElement | null = null;
  private content: HTMLElement | null = null;
  private toggleIcon: HTMLElement | null = null;
  private fontItems: FontItem[] = [];

  protected render(): HTMLElement {
    const container = document.createElement("div");
    container.className = "provider-group";

    // Load saved collapsed state or use prop
    const isCollapsed = this.loadCollapsedState();

    // Provider header
    this.header = document.createElement("div");
    this.header.className = "provider-group__header";

    const nameContainer = document.createElement("div");
    nameContainer.className = "provider-group__name";
    nameContainer.textContent = `${this.props.provider.nameKo} (${this.props.provider.nameEn})`;

    this.toggleIcon = document.createElement("span");
    this.toggleIcon.className = isCollapsed
      ? "provider-group__toggle provider-group__toggle--collapsed"
      : "provider-group__toggle";
    const chevronIcon = createIcon(
      isCollapsed ? "chevron-right" : "chevron-down"
    );
    this.toggleIcon.appendChild(chevronIcon);

    this.header.appendChild(nameContainer);
    this.header.appendChild(this.toggleIcon);

    // Provider content (font items)
    this.content = document.createElement("div");
    this.content.className = isCollapsed
      ? "provider-group__content provider-group__content--collapsed"
      : "provider-group__content";

    // Set initial max-height for collapsed state
    if (isCollapsed) {
      this.content.style.maxHeight = "0";
    }

    // Create FontItem components
    this.fontItems = this.props.fonts.map((font) => {
      const fontItem = new FontItem({
        font,
        onToggle: (enabled: boolean) => {
          this.props.onFontToggle(font.id, enabled);
        },
        onInfoClick: () => {
          this.props.onInfoClick(font.id);
        },
      });
      this.content!.appendChild(fontItem.getElement());
      return fontItem;
    });

    container.appendChild(this.header);
    container.appendChild(this.content);

    return container;
  }

  protected attachEventListeners(): void {
    if (this.header) {
      this.header.addEventListener("click", this.handleToggleClick);
    }
  }

  private handleToggleClick = (): void => {
    // Toggle the collapsed state
    const isCurrentlyCollapsed = this.content?.classList.contains(
      "provider-group__content--collapsed"
    );

    if (isCurrentlyCollapsed) {
      this.expand();
    } else {
      this.collapse();
    }

    // Notify parent component
    this.props.onToggleCollapse();
  };

  /**
   * 그룹을 접기
   * 애니메이션과 함께 그룹을 접습니다.
   */
  public collapse(): void {
    if (this.content && this.toggleIcon) {
      // Set max-height for animation
      const contentHeight = this.content.scrollHeight;
      this.content.style.maxHeight = `${contentHeight}px`;

      // Force reflow to ensure the transition works
      this.content.offsetHeight;

      // Add collapsed class and set max-height to 0
      requestAnimationFrame(() => {
        this.content!.style.maxHeight = "0";
        this.content!.classList.add("provider-group__content--collapsed");
        this.toggleIcon!.classList.add("provider-group__toggle--collapsed");

        // Update icon to chevron-right
        this.toggleIcon!.innerHTML = "";
        const chevronIcon = createIcon("chevron-right");
        this.toggleIcon!.appendChild(chevronIcon);
      });

      // Save collapsed state to localStorage
      this.saveCollapsedState(true);
    }
  }

  /**
   * 그룹을 펼치기
   * 애니메이션과 함께 그룹을 펼칩니다.
   */
  public expand(): void {
    if (this.content && this.toggleIcon) {
      // Remove collapsed class
      this.content.classList.remove("provider-group__content--collapsed");
      this.toggleIcon.classList.remove("provider-group__toggle--collapsed");

      // Update icon to chevron-down
      this.toggleIcon.innerHTML = "";
      const chevronIcon = createIcon("chevron-down");
      this.toggleIcon.appendChild(chevronIcon);

      // Set max-height to content height for animation
      const contentHeight = this.content.scrollHeight;
      this.content.style.maxHeight = `${contentHeight}px`;

      // After animation completes, remove max-height to allow dynamic content
      const handleTransitionEnd = () => {
        if (
          this.content &&
          !this.content.classList.contains("provider-group__content--collapsed")
        ) {
          this.content.style.maxHeight = "";
        }
        this.content?.removeEventListener("transitionend", handleTransitionEnd);
      };
      this.content.addEventListener("transitionend", handleTransitionEnd);

      // Save collapsed state to localStorage
      this.saveCollapsedState(false);
    }
  }

  /**
   * 접힌 상태를 localStorage에 저장
   */
  private saveCollapsedState(collapsed: boolean): void {
    try {
      const key = `provider-collapsed-${this.props.provider.id}`;
      localStorage.setItem(key, JSON.stringify(collapsed));
    } catch (error) {
      console.warn("Failed to save collapsed state:", error);
    }
  }

  /**
   * localStorage에서 접힌 상태를 불러오기
   */
  private loadCollapsedState(): boolean {
    try {
      const key = `provider-collapsed-${this.props.provider.id}`;
      const saved = localStorage.getItem(key);
      return saved ? JSON.parse(saved) : this.props.collapsed;
    } catch (error) {
      console.warn("Failed to load collapsed state:", error);
      return this.props.collapsed;
    }
  }

  /**
   * 컴포넌트 정리
   */
  public destroy(): void {
    if (this.header) {
      this.header.removeEventListener("click", this.handleToggleClick);
    }
    // Destroy all font items
    this.fontItems.forEach((item) => item.destroy());
    this.fontItems = [];
    super.destroy();
  }
}
