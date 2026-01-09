/**
 * DOM Utility Functions
 */

/**
 * HTML 요소를 생성하고 속성을 설정
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  options?: {
    className?: string;
    id?: string;
    textContent?: string;
    attributes?: Record<string, string>;
    children?: (HTMLElement | string)[];
  }
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);

  if (options?.className) {
    element.className = options.className;
  }

  if (options?.id) {
    element.id = options.id;
  }

  if (options?.textContent) {
    element.textContent = options.textContent;
  }

  if (options?.attributes) {
    Object.entries(options.attributes).forEach(([key, value]) => {
      element.setAttribute(key, value);
    });
  }

  if (options?.children) {
    options.children.forEach((child) => {
      if (typeof child === "string") {
        element.appendChild(document.createTextNode(child));
      } else {
        element.appendChild(child);
      }
    });
  }

  return element;
}

/**
 * 클래스 이름을 조건부로 결합
 */
export function classNames(
  ...classes: (string | false | undefined | null)[]
): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * 요소에서 가장 가까운 부모 요소를 찾음
 */
export function closest<T extends HTMLElement>(
  element: HTMLElement,
  selector: string
): T | null {
  return element.closest(selector) as T | null;
}

/**
 * 이벤트 위임을 위한 헬퍼
 */
export function delegate<T extends Event>(
  element: HTMLElement,
  eventType: string,
  selector: string,
  handler: (event: T, target: HTMLElement) => void
): () => void {
  const listener = (event: Event) => {
    const target = (event.target as HTMLElement).closest(selector);
    if (target && element.contains(target as Node)) {
      handler(event as T, target as HTMLElement);
    }
  };

  element.addEventListener(eventType, listener);

  // 리스너 제거 함수 반환
  return () => {
    element.removeEventListener(eventType, listener);
  };
}

/**
 * 요소가 뷰포트에 보이는지 확인
 */
export function isInViewport(element: HTMLElement): boolean {
  const rect = element.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/**
 * 디바운스 함수
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null;
      func(...args);
    };

    if (timeout) {
      clearTimeout(timeout);
    }
    timeout = setTimeout(later, wait);
  };
}

/**
 * 쓰로틀 함수
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;

  return function executedFunction(...args: Parameters<T>) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
