import { MouseButton } from "../types";
import makeDebug from "debug";

const debug = makeDebug("suchibot:input/held-mouse-buttons");

const heldButtons = new Map<MouseButton, boolean>();

export function setButtonState(button: MouseButton, upOrDown: "up" | "down") {
  if (button === MouseButton.ANY) {
    return;
  }
  debug("setting held button state: %s -> %s", button, upOrDown);
  heldButtons.set(button, upOrDown === "down");
}

export function isButtonDown(button: MouseButton): boolean {
  if (button === MouseButton.ANY) {
    for (const [_key, isDown] of heldButtons) {
      if (isDown) {
        debug("isButtonDown(ANY) -> true");
        return true;
      }
    }
    debug("isButtonDown(ANY) -> false");
    return false;
  } else {
    const result = Boolean(heldButtons.get(button));
    debug("isButtonDown(%s) -> %o", button, result);
    return result;
  }
}

export function isButtonUp(button: MouseButton): boolean {
  if (button === MouseButton.ANY) {
    for (const [_key, isDown] of heldButtons) {
      if (!isDown) {
        debug("isButtonUp(ANY) -> true");
        return true;
      }
    }
    debug("isButtonUp(ANY) -> false");
    return false;
  } else {
    const result = !heldButtons.get(button);
    debug("isButtonUp(%s) -> %o", button, result);
    return result;
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

  const result = {
    left,
    right,
    middle,
    mouse4,
    mouse5,
  };
  debug("getMouseButtonsState() -> %o", result);
  return result;
}
