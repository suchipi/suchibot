import { Key } from "../types";
import * as libnut from "../libnut";
import { sleep } from "a-mimir";
import makeDebug from "debug";

const debug = makeDebug("suchibot:output/keyboard");
const libNutDebug = makeDebug("suchibot:output/keyboard/libnut");

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

export const Keyboard = {
  tap(key: Key) {
    debug("Keyboard.tap(%s)", key);
    const nutKey = keyToNut(key);

    libNutDebug("libnut.keyToggle(%s, down)", nutKey);
    libnut.keyToggle(nutKey, "down");
    sleep.sync(10);
    libNutDebug("libnut.keyToggle(%s, up)", nutKey);
    libnut.keyToggle(nutKey, "up");
  },

  hold(key: Key) {
    debug("Keyboard.hold(%s)", key);
    const nutKey = keyToNut(key);
    libNutDebug("libnut.keyToggle(%s, down)", nutKey);
    libnut.keyToggle(nutKey, "down");
  },

  release(key: Key) {
    debug("Keyboard.release(%s)", key);
    const nutKey = keyToNut(key);
    libNutDebug("libnut.keyToggle(%s, up)", nutKey);
    libnut.keyToggle(nutKey, "up");
  },

  type(textToType: string, delayBetweenKeyPresses: number = 10) {
    debug(
      "Keyboard.type(%s, %d)",
      JSON.stringify(textToType),
      delayBetweenKeyPresses
    );

    textToType.split("").forEach((char, index, all) => {
      libNutDebug("libnut.typeString(%s)", char);
      libnut.typeString(char);
      if (index != all.length - 1) {
        sleep.sync(delayBetweenKeyPresses);
      }
    });
  },
};
