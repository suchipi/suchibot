import { Key, Listener } from "../types";
import { uIOhook, UiohookKey } from "uiohook-napi";
import mitt, { Emitter } from "mitt";
import {
  setKeyState,
  isKeyDown,
  isKeyUp,
  KeyboardModifierKeysState,
  getModifierKeysState,
} from "./held-keys";
import { MouseButtonsState, getMouseButtonsState } from "./held-mouse-buttons";
import makeDebug from "debug";

const debug = makeDebug("suchibot:input/keyboard");
const eventsDebug = makeDebug("suchibot:input/keyboard/events");
const uIOhookEventsDebug = makeDebug("suchibot:input/keyboard/events/uiohook");

// ------------ keyboard stuff -------------
const IS_KEYBOARD_EVENT = Symbol("IS_KEYBOARD_EVENT");

export function isKeyboardEvent(event: any): event is KeyboardEvent {
  return typeof event === "object" && event != null && event[IS_KEYBOARD_EVENT];
}

export class KeyboardEvent {
  type: "down" | "up";
  key: Key;
  modifierKeys: KeyboardModifierKeysState;
  mouseButtons: MouseButtonsState;
  [IS_KEYBOARD_EVENT]: true;

  constructor(
    type: "down" | "up",
    key: Key,
    modifierKeys: KeyboardModifierKeysState = getModifierKeysState(),
    mouseButtons: MouseButtonsState = getMouseButtonsState()
  ) {
    this.type = type;
    this.key = key;
    this.modifierKeys = modifierKeys;
    this.mouseButtons = mouseButtons;
    this[IS_KEYBOARD_EVENT] = true;
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

if (eventsDebug.enabled) {
  events.on("*", (type, event) => {
    eventsDebug("event emitted: %s %o", type, event);
  });
}

uIOhook.on("keydown", (event) => {
  uIOhookEventsDebug("uIOhook keydown event: %o", event);

  const key = uioToKey(event.keycode);
  if (!key) {
    console.warn(
      "WARNING: received keydown for unsupported keycode:",
      event.keycode
    );
    return;
  }

  setKeyState(key, "down");

  const newEvent = new KeyboardEvent("down", key);
  events.emit("keydown", newEvent);
});

uIOhook.on("keyup", (event) => {
  uIOhookEventsDebug("uIOhook keyup event: %o", event);

  const key = uioToKey(event.keycode);
  if (!key) {
    console.warn(
      "WARNING: received keyup for unsupported keycode:",
      event.keycode
    );
    return;
  }

  setKeyState(key, "up");

  const newEvent = new KeyboardEvent("up", key);
  events.emit("keyup", newEvent);
});

// ------------ public API -------------
export const Keyboard = {
  onDown(key: Key, eventHandler: (event: KeyboardEvent) => void): Listener {
    debug("Keyboard.onDown called: %s, %o", key, eventHandler);

    const callback = (event) => {
      if (key === Key.ANY || event.key === key) {
        eventHandler(event);
      }
    };

    events.on("keydown", callback);
    return {
      stop() {
        debug("Keyboard.onDown(%s, ...).stop called", key);
        events.off("keydown", callback);
      },
    };
  },

  onUp(key: Key, eventHandler: (event: KeyboardEvent) => void): Listener {
    debug("Keyboard.onUp called: %s, %o", key, eventHandler);

    const callback = (event) => {
      if (key === Key.ANY || event.key === key) {
        eventHandler(event);
      }
    };

    events.on("keyup", callback);
    return {
      stop() {
        debug("Keyboard.onUp(%s, ...).stop called", key);
        events.off("keyup", callback);
      },
    };
  },

  isDown(key: Key): boolean {
    const result = isKeyDown(key);
    debug("Keyboard.isDown(%s) -> %o", key, result);
    return result;
  },

  isUp(key: Key): boolean {
    const result = isKeyUp(key);
    debug("Keyboard.isUp(%s) -> %o", key, result);
    return result;
  },
};
