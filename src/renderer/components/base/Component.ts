/**
 * Base Component Class
 * 모든 UI 컴포넌트의 기본 클래스
 */

export abstract class Component<T = any> {
  protected element: HTMLElement;
  protected props: T;

  constructor(props: T) {
    this.props = props;
    this.element = this.render();
    this.attachEventListeners();
  }

  /**
   * 컴포넌트의 DOM 요소를 생성하고 반환
   */
  protected abstract render(): HTMLElement;

  /**
   * 이벤트 리스너를 연결 (선택적)
   */
  protected attachEventListeners(): void {
    // Override in subclasses if needed
  }

  /**
   * 컴포넌트의 DOM 요소를 반환
   */
  public getElement(): HTMLElement {
    return this.element;
  }

  /**
   * 컴포넌트를 DOM에 마운트
   */
  public mount(parent: HTMLElement): void {
    parent.appendChild(this.element);
  }

  /**
   * 컴포넌트를 DOM에서 제거
   */
  public unmount(): void {
    if (this.element.parentElement) {
      this.element.parentElement.removeChild(this.element);
    }
  }

  /**
   * Props를 업데이트하고 다시 렌더링
   */
  public update(newProps: Partial<T>): void {
    this.props = { ...this.props, ...newProps };
    const newElement = this.render();
    if (this.element.parentElement) {
      this.element.parentElement.replaceChild(newElement, this.element);
    }
    this.element = newElement;
    this.attachEventListeners();
  }

  /**
   * 컴포넌트 정리 (메모리 누수 방지)
   */
  public destroy(): void {
    this.unmount();
  }
}
