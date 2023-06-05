import { MouseButton } from "../types";

const heldButtons = new Map<MouseButton, boolean>();

export function setButtonState(button: MouseButton, upOrDown: "up" | "down") {
  if (button === MouseButton.ANY) {
    return;
  }
  heldButtons.set(button, upOrDown === "down");
}

export function isButtonDown(button: MouseButton): boolean {
  if (button === MouseButton.ANY) {
    for (const [_key, isDown] of heldButtons) {
      if (isDown) {
        return true;
      }
    }
    return false;
  } else {
    return Boolean(heldButtons.get(button));
  }
}

export function isButtonUp(button: MouseButton): boolean {
  if (button === MouseButton.ANY) {
    for (const [_key, isDown] of heldButtons) {
      if (!isDown) {
        return true;
      }
    }
    return false;
  } else {
    return !heldButtons.get(button);
  }
}

export type MouseButtonsState = {
  left: boolean;
  right: boolean;
  middle: boolean;
  mouse4: boolean;
  mouse5: boolean;
};

export function getMouseButtonsState(): MouseButtonsState {
  const left = Boolean(heldButtons.get(MouseButton.LEFT));
  const right = Boolean(heldButtons.get(MouseButton.RIGHT));
  const middle = Boolean(heldButtons.get(MouseButton.MIDDLE));
  const mouse4 = Boolean(heldButtons.get(MouseButton.MOUSE4));
  const mouse5 = Boolean(heldButtons.get(MouseButton.MOUSE5));

  return {
    left,
    right,
    middle,
    mouse4,
    mouse5,
  };
}
