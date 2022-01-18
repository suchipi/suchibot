import { Key, MouseButton } from "./types";
import * as libnut from "@nut-tree/libnut";
import { sleepSync } from "./sleep";

const keyToNutMap: { [key in keyof typeof Key]: string | null } = {
  BACKSPACE: "backspace",
  DELETE: "delete",
  ENTER: "enter",
  TAB: "tab",
  ESCAPE: "escape",
  UP: "up",
  DOWN: "down",
  RIGHT: "right",
  LEFT: "left",
  HOME: "home",
  END: "end",
  PAGE_UP: "pageup",
  PAGE_DOWN: "pagedown",
  F1: "f1",
  F2: "f2",
  F3: "f3",
  F4: "f4",
  F5: "f5",
  F6: "f6",
  F7: "f7",
  F8: "f8",
  F9: "f9",
  F10: "f10",
  F11: "f11",
  F12: "f12",
  F13: "f13",
  F14: "f14",
  F15: "f15",
  F16: "f16",
  F17: "f17",
  F18: "f18",
  F19: "f19",
  F20: "f20",
  F21: "f21",
  F22: "f22",
  F23: "f23",
  F24: "f24",

  LEFT_ALT: "alt",
  RIGHT_ALT: "alt",

  LEFT_CONTROL: "control",
  RIGHT_CONTROL: "control",

  LEFT_SHIFT: "shift",
  RIGHT_SHIFT: "space",

  SPACE: "space",
  PRINT_SCREEN: "printscreen",
  INSERT: "insert",
  VOLUME_DOWN: "audio_vol_down",
  VOLUME_UP: "audio_vol_up",
  MUTE: "audio_mute",
  NUMPAD_0: "numpad_0",
  NUMPAD_1: "numpad_1",
  NUMPAD_2: "numpad_2",
  NUMPAD_3: "numpad_3",
  NUMPAD_4: "numpad_4",
  NUMPAD_5: "numpad_5",
  NUMPAD_6: "numpad_6",
  NUMPAD_7: "numpad_7",
  NUMPAD_8: "numpad_8",
  NUMPAD_9: "numpad_9",

  A: "a",
  B: "b",
  C: "c",
  D: "d",
  E: "e",
  F: "f",
  G: "g",
  H: "h",
  I: "i",
  J: "j",
  K: "k",
  L: "l",
  M: "m",
  N: "n",
  O: "o",
  P: "p",
  Q: "q",
  R: "r",
  S: "s",
  T: "t",
  U: "u",
  V: "v",
  W: "w",
  X: "x",
  Y: "y",
  Z: "z",

  ZERO: "0",
  ONE: "1",
  TWO: "2",
  THREE: "3",
  FOUR: "4",
  FIVE: "5",
  SIX: "6",
  SEVEN: "7",
  EIGHT: "8",
  NINE: "9",

  ANY: null,

  CAPS_LOCK: null,
  NUMPAD_MULTIPLY: null,
  NUMPAD_ADD: null,
  NUMPAD_SUBTRACT: null,
  NUMPAD_DECIMAL: null,
  NUMPAD_DIVIDE: null,
  NUMPAD_ENTER: "enter",
  SEMICOLON: ";",

  EQUAL: "=",
  COMMA: ",",
  MINUS: "-",
  PERIOD: ".",
  SLASH: "/",
  BACKTICK: "~",
  LEFT_BRACKET: "[",
  BACKSLASH: "\\",
  RIGHT_BRACKET: "]",
  QUOTE: "'",

  SCROLL_LOCK: null,
  PAUSE_BREAK: null,
  NUM_LOCK: null,

  LEFT_COMMAND: "command",
  LEFT_WINDOWS: "command",
  LEFT_SUPER: "command",
  LEFT_META: "command",

  RIGHT_COMMAND: "command",
  RIGHT_WINDOWS: "command",
  RIGHT_SUPER: "command",
  RIGHT_META: "command",
};

const mouseButtonToNutMap: {
  [key in keyof typeof MouseButton]: string | null;
} = {
  LEFT: "left",
  RIGHT: "right",
  MIDDLE: "middle",

  ANY: null,
};

function keyToNut(key: Key): string {
  if (key === Key.ANY) {
    throw new Error(
      `The "ANY" key is for input listeners only; it can't be pressed/released`
    );
  }

  const result = keyToNutMap[key];

  if (result == null) {
    throw new Error("Pressing/releasing key is not yet supported: " + key);
  }
  return result;
}

function mouseButtonToNut(button: MouseButton): string {
  if (button === MouseButton.ANY) {
    throw new Error(
      `The "ANY" mouse button is for input listeners only; it can't be pressed/released`
    );
  }

  const result = mouseButtonToNutMap[button];
  if (result == null) {
    throw new Error(
      "Pressing/releasing mouse button is not yet supported: " + button
    );
  }
  return result;
}

export const Keyboard = {
  tap(key: Key) {
    const nutKey = keyToNut(key);

    libnut.keyToggle(nutKey, "down");
    sleepSync(10);
    libnut.keyToggle(nutKey, "up");
  },

  hold(key: Key) {
    const nutKey = keyToNut(key);
    libnut.keyToggle(nutKey, "down");
  },

  release(key: Key) {
    const nutKey = keyToNut(key);
    libnut.keyToggle(nutKey, "up");
  },

  type(textToType: string, delayBetweenKeyPresses: number = 10) {
    textToType.split("").forEach((char, index, all) => {
      libnut.typeString(char);
      if (index != all.length - 1) {
        sleepSync(delayBetweenKeyPresses);
      }
    });
  },
};

export const Mouse = {
  moveTo(x: number, y: number) {
    libnut.moveMouse(x, y);
  },
  click(button: MouseButton = MouseButton.LEFT) {
    const nutButton = mouseButtonToNut(button);

    libnut.mouseToggle("down", nutButton);
    sleepSync(4);
    libnut.mouseToggle("up", nutButton);
  },
  doubleClick(button: MouseButton = MouseButton.LEFT) {
    const nutButton = mouseButtonToNut(button);

    libnut.mouseToggle("down", nutButton);
    sleepSync(4);
    libnut.mouseToggle("up", nutButton);
    sleepSync(4);
    libnut.mouseToggle("down", nutButton);
    sleepSync(4);
    libnut.mouseToggle("up", nutButton);
  },
  hold(button: MouseButton = MouseButton.LEFT) {
    const nutButton = mouseButtonToNut(button);

    libnut.mouseToggle("down", nutButton);
  },
  release(button: MouseButton = MouseButton.LEFT) {
    const nutButton = mouseButtonToNut(button);

    libnut.mouseToggle("up", nutButton);
  },
  getPosition(): { x: number; y: number } {
    return libnut.getMousePos();
  },
  scroll({ x = 0, y = 0 } = {}) {
    libnut.scrollMouse(x, y);
  },
};

export const Screen = {
  getSize(): { width: number; height: number } {
    return libnut.getScreenSize();
  },
};
