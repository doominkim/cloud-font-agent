/**
 * FontInfoModal Component
 * 폰트 상세 정보를 표시하는 모달 컴포넌트
 */

import { Component } from "./base/Component";
import { FontInfoModalProps } from "../../types/ui";
import { formatFileSize } from "../utils/format";
import { createIcon } from "../utils/icons";

export class FontInfoModal extends Component<FontInfoModalProps> {
  private overlay: HTMLElement | null = null;
  private modal: HTMLElement | null = null;
  private closeButton: HTMLButtonElement | null = null;
  private isVisible: boolean = false;

  protected render(): HTMLElement {
    // Create overlay
    this.overlay = document.createElement("div");
    this.overlay.className = "modal-overlay";
    this.overlay.style.display = "none"; // Hidden by default

    // Create modal container
    this.modal = document.createElement("div");
    this.modal.className = "modal font-info-modal";

    // Modal header
    const header = document.createElement("div");
    header.className = "modal__header";

    const title = document.createElement("h2");
    title.className = "modal__title";
    title.textContent = "폰트 정보";

    this.closeButton = document.createElement("button");
    this.closeButton.className = "modal__close";
    this.closeButton.setAttribute("aria-label", "닫기");
    const closeIcon = createIcon("close");
    this.closeButton.appendChild(closeIcon);

    header.appendChild(title);
    header.appendChild(this.closeButton);

    // Modal body
    const body = document.createElement("div");
    body.className = "modal__body";

    // Font preview section
    const previewSection = document.createElement("div");
    previewSection.className = "font-info__preview";

    const previewLabel = document.createElement("div");
    previewLabel.className = "font-info__label";
    previewLabel.textContent = "미리보기";

    const previewText = document.createElement("div");
    previewText.className = "font-info__preview-text";
    previewText.textContent = this.props.fontInfo.previewText;
    previewText.style.fontFamily = this.props.fontInfo.name;

    previewSection.appendChild(previewLabel);
    previewSection.appendChild(previewText);

    // Font details section
    const detailsSection = document.createElement("div");
    detailsSection.className = "font-info__details";

    // Font name
    const nameRow = this.createDetailRow("폰트 이름", this.props.fontInfo.name);

    // Version
    const versionRow = this.createDetailRow(
      "버전",
      `v${this.props.fontInfo.version}`
    );

    // Provider
    const providerRow = this.createDetailRow(
      "제공업체",
      this.props.fontInfo.provider
    );

    // License
    const licenseRow = this.createDetailRow(
      "라이선스",
      this.props.fontInfo.license
    );

    // File size
    const fileSizeRow = this.createDetailRow(
      "파일 크기",
      formatFileSize(this.props.fontInfo.fileSize)
    );

    detailsSection.appendChild(nameRow);
    detailsSection.appendChild(versionRow);
    detailsSection.appendChild(providerRow);
    detailsSection.appendChild(licenseRow);
    detailsSection.appendChild(fileSizeRow);

    body.appendChild(previewSection);
    body.appendChild(detailsSection);

    this.modal.appendChild(header);
    this.modal.appendChild(body);

    this.overlay.appendChild(this.modal);

    return this.overlay;
  }

  /**
   * Create a detail row with label and value
   */
  private createDetailRow(label: string, value: string): HTMLElement {
    const row = document.createElement("div");
    row.className = "font-info__detail-row";

    const labelEl = document.createElement("div");
    labelEl.className = "font-info__detail-label";
    labelEl.textContent = label;

    const valueEl = document.createElement("div");
    valueEl.className = "font-info__detail-value";
    valueEl.textContent = value;

    row.appendChild(labelEl);
    row.appendChild(valueEl);

    return row;
  }

  protected attachEventListeners(): void {
    if (this.closeButton) {
      this.closeButton.addEventListener("click", this.handleClose);
    }

    if (this.overlay) {
      this.overlay.addEventListener("click", this.handleOverlayClick);
    }

    // ESC key handler
    document.addEventListener("keydown", this.handleEscKey);
  }

  /**
   * Handle close button click
   */
  private handleClose = (): void => {
    this.hide();
    this.props.onClose();
  };

  /**
   * Handle overlay click (close when clicking outside modal)
   */
  private handleOverlayClick = (event: MouseEvent): void => {
    if (event.target === this.overlay) {
      this.hide();
      this.props.onClose();
    }
  };

  /**
   * Handle ESC key press
   */
  private handleEscKey = (event: KeyboardEvent): void => {
    if (event.key === "Escape" && this.isVisible) {
      this.hide();
      this.props.onClose();
    }
  };

  /**
   * Show the modal
   */
  public show(): void {
    if (this.overlay) {
      this.overlay.style.display = "flex";
      this.isVisible = true;
      // Prevent body scroll when modal is open
      document.body.style.overflow = "hidden";
    }
  }

  /**
   * Hide the modal
   */
  public hide(): void {
    if (this.overlay) {
      this.overlay.style.display = "none";
      this.isVisible = false;
      // Restore body scroll
      document.body.style.overflow = "";
    }
  }

  /**
   * Check if modal is currently visible
   */
  public isShown(): boolean {
    return this.isVisible;
  }

  /**
   * Clean up event listeners
   */
  public destroy(): void {
    if (this.closeButton) {
      this.closeButton.removeEventListener("click", this.handleClose);
    }

    if (this.overlay) {
      this.overlay.removeEventListener("click", this.handleOverlayClick);
    }

    document.removeEventListener("keydown", this.handleEscKey);

    // Restore body scroll if modal was visible
    if (this.isVisible) {
      document.body.style.overflow = "";
    }

    super.destroy();
  }
}
