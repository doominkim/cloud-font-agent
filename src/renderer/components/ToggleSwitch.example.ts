/**
 * ToggleSwitch Component Example
 * 토글 스위치 컴포넌트 사용 예제
 */

import { ToggleSwitch } from "./ToggleSwitch";

// Example 1: 기본 토글 스위치
export function createBasicToggle(): ToggleSwitch {
  return new ToggleSwitch({
    enabled: false,
    onChange: (enabled) => {
      console.log("Toggle state changed:", enabled);
    },
  });
}

// Example 2: 초기 활성화 상태 토글
export function createEnabledToggle(): ToggleSwitch {
  return new ToggleSwitch({
    enabled: true,
    onChange: (enabled) => {
      console.log("Toggle is now:", enabled ? "ON" : "OFF");
    },
  });
}

// Example 3: 비활성화된 토글
export function createDisabledToggle(): ToggleSwitch {
  return new ToggleSwitch({
    enabled: true,
    disabled: true,
    onChange: (enabled) => {
      // 비활성화 상태에서는 호출되지 않음
      console.log("This should not be called");
    },
  });
}

// Example 4: 폰트 등록/해제 시뮬레이션
export function createFontToggle(): ToggleSwitch {
  const toggle = new ToggleSwitch({
    enabled: false,
    onChange: async (enabled) => {
      console.log(`${enabled ? "Registering" : "Unregistering"} font...`);

      // 처리 중 토글 비활성화
      toggle.setDisabled(true);

      // 비동기 작업 시뮬레이션
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 성공 시뮬레이션 (90% 확률)
      const success = Math.random() > 0.1;

      if (success) {
        console.log(
          `Font ${enabled ? "registered" : "unregistered"} successfully`
        );
        toggle.setEnabled(enabled);
      } else {
        console.error("Font operation failed");
        // 실패 시 이전 상태로 롤백
        toggle.setEnabled(!enabled);
      }

      // 토글 다시 활성화
      toggle.setDisabled(false);
    },
  });

  return toggle;
}

// Example 5: 여러 토글 동기화
export function createSyncedToggles(): ToggleSwitch[] {
  let masterState = false;

  const toggles = Array.from({ length: 3 }, (_, index) => {
    return new ToggleSwitch({
      enabled: masterState,
      onChange: (enabled) => {
        masterState = enabled;
        console.log(`Toggle ${index + 1} changed to:`, enabled);

        // 다른 토글들도 동기화
        toggles.forEach((t, i) => {
          if (i !== index) {
            t.setEnabled(enabled);
          }
        });
      },
    });
  });

  return toggles;
}

// Example 6: 프로그래밍 방식 제어
export function createProgrammaticToggle(): {
  toggle: ToggleSwitch;
  enable: () => void;
  disable: () => void;
  toggleState: () => void;
} {
  const toggle = new ToggleSwitch({
    enabled: false,
    onChange: (enabled) => {
      console.log("User toggled:", enabled);
    },
  });

  return {
    toggle,
    enable: () => {
      console.log("Programmatically enabling...");
      toggle.setEnabled(true);
    },
    disable: () => {
      console.log("Programmatically disabling...");
      toggle.setEnabled(false);
    },
    toggleState: () => {
      const currentState = toggle.isEnabled();
      console.log("Toggling from", currentState, "to", !currentState);
      toggle.setEnabled(!currentState);
    },
  };
}

// Example 7: 에러 처리가 있는 토글
export function createToggleWithErrorHandling(): ToggleSwitch {
  let attemptCount = 0;

  return new ToggleSwitch({
    enabled: false,
    onChange: async (enabled) => {
      attemptCount++;
      console.log(`Attempt ${attemptCount}: ${enabled ? "Enable" : "Disable"}`);

      try {
        // 비동기 작업 시뮬레이션
        await new Promise((resolve, reject) => {
          setTimeout(() => {
            // 3번째 시도에서 성공
            if (attemptCount >= 3) {
              resolve(true);
            } else {
              reject(new Error("Operation failed"));
            }
          }, 500);
        });

        console.log("Success!");
      } catch (error) {
        console.error("Error:", error);
        // 에러 발생 시 상태 롤백
        throw error;
      }
    },
  });
}

// Demo function to showcase all examples
export function runToggleSwitchDemo(): void {
  console.log("=== ToggleSwitch Component Demo ===\n");

  // Example 1
  console.log("1. Basic Toggle:");
  const basicToggle = createBasicToggle();
  console.log("Initial state:", basicToggle.isEnabled());

  // Example 2
  console.log("\n2. Enabled Toggle:");
  const enabledToggle = createEnabledToggle();
  console.log("Initial state:", enabledToggle.isEnabled());

  // Example 3
  console.log("\n3. Disabled Toggle:");
  const disabledToggle = createDisabledToggle();
  console.log("Initial state:", disabledToggle.isEnabled());

  // Example 4
  console.log("\n4. Font Toggle (async):");
  const fontToggle = createFontToggle();

  // Example 6
  console.log("\n6. Programmatic Control:");
  const { toggle, enable, disable, toggleState } = createProgrammaticToggle();
  console.log("Initial state:", toggle.isEnabled());
  enable();
  console.log("After enable:", toggle.isEnabled());
  disable();
  console.log("After disable:", toggle.isEnabled());
  toggleState();
  console.log("After toggle:", toggle.isEnabled());
}
