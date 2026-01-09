/**
 * ToggleSwitch Component
 * 폰트 활성화/비활성화를 위한 토글 스위치 컴포넌트
 */

import { Component } from "./base/Component";
import { ToggleSwitchProps } from "../../types/ui";

export class ToggleSwitch extends Component<ToggleSwitchProps> {
  private input: HTMLInputElement | null = null;

  protected render(): HTMLElement {
    const container = document.createElement("label");
    container.className = "toggle";

    // Hidden checkbox input
    this.input = document.createElement("input");
    this.input.type = "checkbox";
    this.input.className = "toggle__input";
    this.input.checked = this.props.enabled;
    this.input.disabled = this.props.disabled || false;

    // Slider element
    const slider = document.createElement("span");
    slider.className = "toggle__slider";

    container.appendChild(this.input);
    container.appendChild(slider);

    return container;
  }

  protected attachEventListeners(): void {
    if (this.input) {
      this.input.addEventListener("change", this.handleChange);
    }
  }

  private handleChange = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.props.onChange(target.checked);
  };

  /**
   * 토글 상태를 프로그래밍 방식으로 설정
   */
  public setEnabled(enabled: boolean): void {
    if (this.input) {
      this.input.checked = enabled;
    }
    this.props.enabled = enabled;
  }

  /**
   * 토글 비활성화 상태를 설정
   */
  public setDisabled(disabled: boolean): void {
    if (this.input) {
      this.input.disabled = disabled;
    }
    this.props.disabled = disabled;
  }

  /**
   * 현재 토글 상태를 반환
   */
  public isEnabled(): boolean {
    return this.input ? this.input.checked : this.props.enabled;
  }

  /**
   * 컴포넌트 정리
   */
  public destroy(): void {
    if (this.input) {
      this.input.removeEventListener("change", this.handleChange);
    }
    super.destroy();
  }
}
