import { Key } from "../types";
import makeDebug from "debug";

const debug = makeDebug("suchibot:input/held-keys");

const heldKeys = new Map<Key, boolean>();

export function setKeyState(key: Key, upOrDown: "up" | "down") {
  if (key === Key.ANY) {
    return;
  }
  debug("setting held key state: %s -> %s", key, upOrDown);
  heldKeys.set(key, upOrDown === "down");
}

export function isKeyDown(key: Key): boolean {
  if (key === Key.ANY) {
    for (const [_key, isDown] of heldKeys) {
      if (isDown) {
        debug("isKeyDown(ANY) -> true");
        return true;
      }
    }
    debug("isKeyDown(ANY) -> false");
    return false;
  } else {
    const result = Boolean(heldKeys.get(key));
    debug("isKeyDown(%s) -> %o", key, result);
    return result;
  }
}

export function isKeyUp(key: Key): boolean {
  if (key === Key.ANY) {
    for (const [_key, isDown] of heldKeys) {
      if (!isDown) {
        debug("isKeyUp(ANY) -> true");
        return true;
      }
    }
    debug("isKeyUp(ANY) -> false");
    return false;
  } else {
    const result = !heldKeys.get(key);
    debug("isKeyUp(%s) -> %o", key, result);
    return result;
  }
}

export type KeyboardModifierKeysState = {
  alt: boolean;
  control: boolean;
  shift: boolean;
  super: boolean;
  windows: boolean;
  command: boolean;
  meta: boolean;

  leftAlt: boolean;
  leftControl: boolean;
  leftShift: boolean;
  leftSuper: boolean;
  leftWindows: boolean;
  leftCommand: boolean;
  leftMeta: boolean;

  rightAlt: boolean;
  rightControl: boolean;
  rightShift: boolean;
  rightSuper: boolean;
  rightWindows: boolean;
  rightCommand: boolean;
  rightMeta: boolean;
};

export function getModifierKeysState(): KeyboardModifierKeysState {
  const leftAlt = Boolean(heldKeys.get(Key.LEFT_ALT));
  const leftControl = Boolean(heldKeys.get(Key.LEFT_CONTROL));
  const leftShift = Boolean(heldKeys.get(Key.LEFT_SHIFT));
  const leftSuper = Boolean(heldKeys.get(Key.LEFT_SUPER));

  const rightAlt = Boolean(heldKeys.get(Key.RIGHT_ALT));
  const rightControl = Boolean(heldKeys.get(Key.RIGHT_CONTROL));
  const rightShift = Boolean(heldKeys.get(Key.RIGHT_SHIFT));
  const rightSuper = Boolean(heldKeys.get(Key.RIGHT_SUPER));

  const alt = leftAlt || rightAlt;
  const control = leftControl || rightControl;
  const shift = leftShift || rightShift;
  const super_ = leftSuper || rightSuper;

  const result = {
    alt,
    control,
    shift,
    super: super_,
    windows: super_,
    command: super_,
    meta: super_,

    leftAlt,
    leftControl,
    leftShift,
    leftSuper,
    leftWindows: leftSuper,
    leftCommand: leftSuper,
    leftMeta: leftSuper,

    rightAlt,
    rightControl,
    rightShift,
    rightSuper,
    rightWindows: rightSuper,
    rightCommand: rightSuper,
    rightMeta: rightSuper,
  };

  debug("getModifierKeysState() -> %o", result);
  return result;
}
