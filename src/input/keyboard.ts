import { Key, Listener } from "../types";
import { uIOhook, UiohookKey } from "uiohook-napi";
import mitt, { Emitter } from "mitt";

// ------------ keyboard stuff -------------
const IS_KEYBOARD_EVENT = Symbol("IS_KEYBOARD_EVENT");

export function isKeyboardEvent(event: any): event is KeyboardEvent {
  return typeof event === "object" && event != null && event[IS_KEYBOARD_EVENT];
}

const modifierKeysToTrack = new Set([
  Key.LEFT_ALT,
  Key.LEFT_CONTROL,
  Key.LEFT_SHIFT,
  Key.LEFT_SUPER,
  Key.RIGHT_ALT,
  Key.RIGHT_CONTROL,
  Key.RIGHT_SHIFT,
  Key.RIGHT_SUPER,
]);
const modifierKeyState: { [key: Key]: boolean } = Array.from(
  modifierKeysToTrack
).reduce((obj, key) => {
  obj[key] = false;
  return obj;
}, {});

function makeModifierKeysObj(): KeyboardModifierKeysState {
  return {
    alt: modifierKeyState[Key.LEFT_ALT] || modifierKeyState[Key.RIGHT_ALT],
    control:
      modifierKeyState[Key.LEFT_CONTROL] || modifierKeyState[Key.RIGHT_CONTROL],
    shift:
      modifierKeyState[Key.LEFT_SHIFT] || modifierKeyState[Key.RIGHT_SHIFT],
    super:
      modifierKeyState[Key.LEFT_SUPER] || modifierKeyState[Key.RIGHT_SUPER],
    windows:
      modifierKeyState[Key.LEFT_WINDOWS] || modifierKeyState[Key.RIGHT_WINDOWS],
    command:
      modifierKeyState[Key.LEFT_COMMAND] || modifierKeyState[Key.RIGHT_COMMAND],
    meta: modifierKeyState[Key.LEFT_META] || modifierKeyState[Key.RIGHT_META],

    leftAlt: modifierKeyState[Key.LEFT_ALT],
    leftControl: modifierKeyState[Key.LEFT_CONTROL],
    leftShift: modifierKeyState[Key.LEFT_SHIFT],
    leftSuper: modifierKeyState[Key.LEFT_SUPER],
    leftWindows: modifierKeyState[Key.LEFT_WINDOWS],
    leftCommand: modifierKeyState[Key.LEFT_COMMAND],
    leftMeta: modifierKeyState[Key.LEFT_META],

    rightAlt: modifierKeyState[Key.RIGHT_ALT],
    rightControl: modifierKeyState[Key.RIGHT_CONTROL],
    rightShift: modifierKeyState[Key.RIGHT_SHIFT],
    rightSuper: modifierKeyState[Key.RIGHT_SUPER],
    rightWindows: modifierKeyState[Key.RIGHT_WINDOWS],
    rightCommand: modifierKeyState[Key.RIGHT_COMMAND],
    rightMeta: modifierKeyState[Key.RIGHT_META],
  };
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

export class KeyboardEvent {
  type: "down" | "up";
  key: Key;
  modifierKeys: KeyboardModifierKeysState;
  [IS_KEYBOARD_EVENT]: true;

  constructor(type: "down" | "up", key: Key) {
    this.type = type;
    this.key = key;
    this[IS_KEYBOARD_EVENT] = true;
    this.modifierKeys = makeModifierKeysObj();
  }
}

const uioToKeyMap = {
  [UiohookKey.Tab]: Key.TAB,
  [UiohookKey.Enter]: Key.ENTER,
  [UiohookKey.CapsLock]: Key.CAPS_LOCK,
  [UiohookKey.Escape]: Key.ESCAPE,
  [UiohookKey.Space]: Key.SPACE,
  [UiohookKey.PageUp]: Key.PAGE_UP,
  [UiohookKey.PageDown]: Key.PAGE_DOWN,
  [UiohookKey.End]: Key.END,
  [UiohookKey.Home]: Key.HOME,
  [UiohookKey.ArrowLeft]: Key.LEFT,
  [UiohookKey.ArrowUp]: Key.UP,
  [UiohookKey.ArrowRight]: Key.RIGHT,
  [UiohookKey.ArrowDown]: Key.DOWN,
  [UiohookKey.Insert]: Key.INSERT,
  [UiohookKey.Delete]: Key.DELETE,
  [UiohookKey[0]]: Key.ZERO,
  [UiohookKey[1]]: Key.ONE,
  [UiohookKey[2]]: Key.TWO,
  [UiohookKey[3]]: Key.THREE,
  [UiohookKey[4]]: Key.FOUR,
  [UiohookKey[5]]: Key.FIVE,
  [UiohookKey[6]]: Key.SIX,
  [UiohookKey[7]]: Key.SEVEN,
  [UiohookKey[8]]: Key.EIGHT,
  [UiohookKey[9]]: Key.NINE,
  [UiohookKey.A]: Key.A,
  [UiohookKey.B]: Key.B,
  [UiohookKey.C]: Key.C,
  [UiohookKey.D]: Key.D,
  [UiohookKey.E]: Key.E,
  [UiohookKey.F]: Key.F,
  [UiohookKey.G]: Key.G,
  [UiohookKey.H]: Key.H,
  [UiohookKey.I]: Key.I,
  [UiohookKey.J]: Key.J,
  [UiohookKey.K]: Key.K,
  [UiohookKey.L]: Key.L,
  [UiohookKey.M]: Key.M,
  [UiohookKey.N]: Key.N,
  [UiohookKey.O]: Key.O,
  [UiohookKey.P]: Key.P,
  [UiohookKey.Q]: Key.Q,
  [UiohookKey.R]: Key.R,
  [UiohookKey.S]: Key.S,
  [UiohookKey.T]: Key.T,
  [UiohookKey.U]: Key.U,
  [UiohookKey.V]: Key.V,
  [UiohookKey.W]: Key.W,
  [UiohookKey.X]: Key.X,
  [UiohookKey.Y]: Key.Y,
  [UiohookKey.Z]: Key.Z,
  [UiohookKey.Numpad0]: Key.NUMPAD_0,
  [UiohookKey.Numpad1]: Key.NUMPAD_1,
  [UiohookKey.Numpad2]: Key.NUMPAD_2,
  [UiohookKey.Numpad3]: Key.NUMPAD_3,
  [UiohookKey.Numpad4]: Key.NUMPAD_4,
  [UiohookKey.Numpad5]: Key.NUMPAD_5,
  [UiohookKey.Numpad6]: Key.NUMPAD_6,
  [UiohookKey.Numpad7]: Key.NUMPAD_7,
  [UiohookKey.Numpad8]: Key.NUMPAD_8,
  [UiohookKey.Numpad9]: Key.NUMPAD_9,
  [UiohookKey.NumpadMultiply]: Key.NUMPAD_MULTIPLY,
  [UiohookKey.NumpadAdd]: Key.NUMPAD_ADD,
  [UiohookKey.NumpadSubtract]: Key.NUMPAD_SUBTRACT,
  [UiohookKey.NumpadDecimal]: Key.NUMPAD_DECIMAL,
  3612: Key.NUMPAD_ENTER,
  [UiohookKey.NumpadDivide]: Key.NUMPAD_DIVIDE,
  [UiohookKey.F1]: Key.F1,
  [UiohookKey.F2]: Key.F2,
  [UiohookKey.F3]: Key.F3,
  [UiohookKey.F4]: Key.F4,
  [UiohookKey.F5]: Key.F5,
  [UiohookKey.F6]: Key.F6,
  [UiohookKey.F7]: Key.F7,
  [UiohookKey.F8]: Key.F8,
  [UiohookKey.F9]: Key.F9,
  [UiohookKey.F10]: Key.F10,
  [UiohookKey.F11]: Key.F11,
  [UiohookKey.F12]: Key.F12,
  [UiohookKey.F13]: Key.F13,
  [UiohookKey.F14]: Key.F14,
  [UiohookKey.F15]: Key.F15,
  [UiohookKey.F16]: Key.F16,
  [UiohookKey.F17]: Key.F17,
  [UiohookKey.F18]: Key.F18,
  [UiohookKey.F19]: Key.F19,
  [UiohookKey.F20]: Key.F20,
  [UiohookKey.F21]: Key.F21,
  [UiohookKey.F22]: Key.F22,
  [UiohookKey.F23]: Key.F23,
  [UiohookKey.F24]: Key.F24,
  [UiohookKey.Semicolon]: Key.SEMICOLON,
  [UiohookKey.Equal]: Key.EQUAL,
  [UiohookKey.Comma]: Key.COMMA,
  [UiohookKey.Minus]: Key.MINUS,
  [UiohookKey.Period]: Key.PERIOD,
  [UiohookKey.Slash]: Key.SLASH,
  [UiohookKey.Backquote]: Key.BACKTICK,
  [UiohookKey.BracketLeft]: Key.LEFT_BRACKET,
  [UiohookKey.Backslash]: Key.BACKSLASH,
  [UiohookKey.BracketRight]: Key.RIGHT_BRACKET,
  [UiohookKey.Quote]: Key.QUOTE,
  [UiohookKey.Ctrl]: Key.LEFT_CONTROL,
  [UiohookKey.Alt]: Key.LEFT_ALT,
  [UiohookKey.Shift]: Key.LEFT_SHIFT,

  70: Key.SCROLL_LOCK,
  3653: Key.PAUSE_BREAK,
  14: Key.BACKSPACE,
  69: Key.NUM_LOCK,

  54: Key.RIGHT_SHIFT,
  3613: Key.RIGHT_CONTROL,
  3640: Key.RIGHT_ALT,

  3675: Key.LEFT_SUPER,
  3676: Key.RIGHT_SUPER,

  57376: Key.MUTE,
  57390: Key.VOLUME_DOWN,
  57392: Key.VOLUME_UP,
};

function uioToKey(uioKey: number): Key | null {
  return uioToKeyMap[uioKey] || null;
}

// ------------ event emitter setup -------------
const events: Emitter<{
  keydown: KeyboardEvent;
  keyup: KeyboardEvent;
}> = mitt();

uIOhook.on("keydown", (event) => {
  const key = uioToKey(event.keycode);
  if (!key) {
    console.warn(
      "WARNING: received keydown for unsupported keycode:",
      event.keycode
    );
    return;
  }

  if (modifierKeysToTrack.has(key)) {
    modifierKeyState[key] = true;
  }

  const newEvent = new KeyboardEvent("down", key);
  events.emit("keydown", newEvent);
});

uIOhook.on("keyup", (event) => {
  const key = uioToKey(event.keycode);
  if (!key) {
    console.warn(
      "WARNING: received keyup for unsupported keycode:",
      event.keycode
    );
    return;
  }

  if (modifierKeysToTrack.has(key)) {
    modifierKeyState[key] = false;
  }

  const newEvent = new KeyboardEvent("up", key);
  events.emit("keyup", newEvent);
});

// ------------ public API -------------
export const Keyboard = {
  onDown(key: Key, eventHandler: (event: KeyboardEvent) => void): Listener {
    const callback = (event) => {
      if (key === Key.ANY || event.key === key) {
        eventHandler(event);
      }
    };

    events.on("keydown", callback);
    return {
      stop() {
        events.off("keydown", callback);
      },
    };
  },

  onUp(key: Key, eventHandler: (event: KeyboardEvent) => void): Listener {
    const callback = (event) => {
      if (key === Key.ANY || event.key === key) {
        eventHandler(event);
      }
    };

    events.on("keyup", callback);
    return {
      stop() {
        events.off("keyup", callback);
      },
    };
  },
};
