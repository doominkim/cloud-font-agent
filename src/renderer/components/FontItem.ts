/**
 * FontItem Component
 * 개별 폰트 정보 및 제어를 표시하는 컴포넌트
 */

import { Component } from "./base/Component";
import { FontItemProps } from "../../types/ui";
import { ToggleSwitch } from "./ToggleSwitch";
import { createIcon } from "../utils/icons";

export class FontItem extends Component<FontItemProps> {
  private toggleSwitch: ToggleSwitch | null = null;
  private infoButton: HTMLButtonElement | null = null;
  private isProcessing: boolean = false;

  protected render(): HTMLElement {
    const container = document.createElement("div");
    container.className = "font-item";

    // Font info section (left side)
    const infoSection = document.createElement("div");
    infoSection.className = "font-item__info";

    const details = document.createElement("div");
    details.className = "font-item__details";

    const name = document.createElement("div");
    name.className = "font-item__name";
    name.textContent = this.props.font.name;

    const version = document.createElement("div");
    version.className = "font-item__version";
    version.textContent = `v${this.props.font.version}`;

    details.appendChild(name);
    details.appendChild(version);
    infoSection.appendChild(details);

    // Actions section (right side)
    const actions = document.createElement("div");
    actions.className = "font-item__actions";

    // Info button
    this.infoButton = document.createElement("button");
    this.infoButton.className = "font-item__info-btn";
    this.infoButton.setAttribute("aria-label", "폰트 정보 보기");
    const infoIcon = createIcon("info");
    this.infoButton.appendChild(infoIcon);

    // Toggle switch
    this.toggleSwitch = new ToggleSwitch({
      enabled: this.props.font.enabled,
      onChange: this.handleToggleChange,
      disabled: false,
    });

    actions.appendChild(this.infoButton);
    actions.appendChild(this.toggleSwitch.getElement());

    container.appendChild(infoSection);
    container.appendChild(actions);

    return container;
  }

  protected attachEventListeners(): void {
    if (this.infoButton) {
      this.infoButton.addEventListener("click", this.handleInfoClick);
    }
  }

  private handleInfoClick = (): void => {
    this.props.onInfoClick();
  };

  /**
   * Handle toggle change with font registration/unregistration
   * Requirements: 4.2, 4.3, 4.5
   */
  private handleToggleChange = async (enabled: boolean): Promise<void> => {
    // Prevent multiple simultaneous operations
    if (this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    // Disable toggle during processing
    if (this.toggleSwitch) {
      this.toggleSwitch.setDisabled(true);
    }

    try {
      if (enabled) {
        // Register font
        // Requirement 4.2: Toggle on → registerFont
        const result = await window.fontAPI.registerFont(
          this.props.font.id,
          this.props.font.downloadUrl,
          this.props.font.name
        );

        if (!result.success) {
          // Registration failed
          // Requirement 4.5: Display error and keep toggle off
          console.error(`Failed to register font: ${result.error}`);

          // Rollback UI state
          if (this.toggleSwitch) {
            this.toggleSwitch.setEnabled(false);
          }
          this.props.font.enabled = false;

          // Show error to user
          alert(`폰트 등록 실패: ${result.error}`);
        } else {
          // Success - update state
          this.props.font.enabled = true;

          // Call parent callback
          this.props.onToggle(true);
        }
      } else {
        // Unregister font
        // Requirement 4.3: Toggle off → unregisterFont
        const result = await window.fontAPI.unregisterFont(this.props.font.id);

        if (!result.success) {
          // Unregistration failed
          // Requirement 4.5: Display error and rollback
          console.error(`Failed to unregister font: ${result.error}`);

          // Rollback UI state
          if (this.toggleSwitch) {
            this.toggleSwitch.setEnabled(true);
          }
          this.props.font.enabled = true;

          // Show error to user
          alert(`폰트 해제 실패: ${result.error}`);
        } else {
          // Success - update state
          this.props.font.enabled = false;

          // Call parent callback
          this.props.onToggle(false);
        }
      }
    } catch (error) {
      // Handle unexpected errors
      // Requirement 4.5: Error handling
      console.error("Font toggle error:", error);

      // Rollback to previous state
      if (this.toggleSwitch) {
        this.toggleSwitch.setEnabled(!enabled);
      }
      this.props.font.enabled = !enabled;

      const errorMessage =
        error instanceof Error ? error.message : String(error);
      alert(`오류 발생: ${errorMessage}`);
    } finally {
      // Re-enable toggle
      if (this.toggleSwitch) {
        this.toggleSwitch.setDisabled(false);
      }
      this.isProcessing = false;
    }
  };

  /**
   * 폰트 활성화 상태를 프로그래밍 방식으로 설정
   */
  public setEnabled(enabled: boolean): void {
    if (this.toggleSwitch) {
      this.toggleSwitch.setEnabled(enabled);
    }
    this.props.font.enabled = enabled;
  }

  /**
   * 컴포넌트 정리
   */
  public destroy(): void {
    if (this.infoButton) {
      this.infoButton.removeEventListener("click", this.handleInfoClick);
    }
    if (this.toggleSwitch) {
      this.toggleSwitch.destroy();
    }
    super.destroy();
  }
}
