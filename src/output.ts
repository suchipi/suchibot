import { Key, ModifierKey, MouseButton } from "./types";
import kleur from "kleur";
import robot from "robotjs";
import os from "os";
import util from "util";

const keyToRobotMap: { [key in keyof typeof Key]: string } = {
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
  PAGE_UP: "page_up",
  PAGE_DOWN: "page_down",
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
  COMMAND: "command",
  ALT: "alt",
  CONTROL: "control",
  SHIFT: "shift",
  RIGHT_SHIFT: "right_shift",
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

  ANY: "any",
};

const modifierKeyToRobotMap: { [key in keyof typeof ModifierKey]: string } = {
  ALT: "alt",
  COMMAND: "command",
  WINDOWS: "win",
  SUPER: "win",
  META: "win",
  CONTROL: "control",
  SHIFT: "shift",
};

const mouseButtonToRobotMap: { [key in keyof typeof MouseButton]: string } = {
  LEFT: "left",
  RIGHT: "right",
  MIDDLE: "middle",
  ANY: "any",
};

const noWindowsSupportKeys = {};

const noLinuxSupportKeys = {
  NUMPAD_0: true,
  NUMPAD_1: true,
  NUMPAD_2: true,
  NUMPAD_3: true,
  NUMPAD_4: true,
  NUMPAD_5: true,
  NUMPAD_6: true,
  NUMPAD_7: true,
  NUMPAD_8: true,
  NUMPAD_9: true,
};

const noMacSupportKeys = {
  PRINT_SCREEN: true,
  INSERT: true,
};

const platform = os.platform();

function keyToRobot(key: Key): string {
  if (key === Key.ANY) {
    throw new Error(
      `The "ANY" key is for input listeners only; it can't be pressed`
    );
  }

  if (platform === "win32" && noWindowsSupportKeys[key]) {
    throw new Error(`Sorry, outputting ${key} is not supported on Windows :(`);
  }

  if (platform === "linux" && noLinuxSupportKeys[key]) {
    throw new Error(`Sorry, outputting ${key} is not supported on Linux :(`);
  }

  if (platform === "darwin" && noMacSupportKeys[key]) {
    throw new Error(`Sorry, outputting ${key} is not supported on macOS :(`);
  }

  const result = keyToRobotMap[key];
  if (!result) {
    throw new Error("Invalid key: " + key);
  }
  return result;
}

function modifierKeyToRobot(mod: ModifierKey): string {
  const result = modifierKeyToRobotMap[mod];
  if (!result) {
    throw new Error("Invalid modifier key: " + mod);
  }
  return result;
}

function mouseButtonToRobot(button: MouseButton): string {
  if (button === MouseButton.ANY) {
    throw new Error(
      `The "ANY" mouse button is for input listeners only; it can't be pressed`
    );
  }

  const result = mouseButtonToRobotMap[button];
  if (!result) {
    throw new Error("Invalid mouse button: " + button);
  }
  return result;
}

function formatArray(array) {
  return array
    .map((item) => util.inspect(item, { depth: Infinity, colors: true }))
    .join(", ");
}

function callRobot(method, ...args) {
  try {
    while (args[args.length - 1] === undefined) {
      args = args.slice(0, -1);
    }
    console.log(kleur.grey(`robot.${method}(${formatArray(args)})`));

    return robot[method].apply(robot, args);
  } catch (err: any) {
    err.message = `RobotJS: ${err.message} in robot.${method}(${formatArray(
      args
    )})`;
    throw err;
  }
}

export const Keyboard = {
  tap(key: Key, modifiers?: ModifierKey | Array<ModifierKey>) {
    const robotKey = keyToRobot(key);
    const robotModifiers = modifiers
      ? Array.isArray(modifiers)
        ? modifiers.map(modifierKeyToRobot)
        : modifierKeyToRobot(modifiers)
      : undefined;

    callRobot("keyTap", robotKey, robotModifiers);
  },

  hold(key: Key, modifiers?: ModifierKey | Array<ModifierKey>) {
    const robotKey = keyToRobot(key);
    const robotModifiers = modifiers
      ? Array.isArray(modifiers)
        ? modifiers.map(modifierKeyToRobot)
        : modifierKeyToRobot(modifiers)
      : undefined;

    callRobot("keyToggle", robotKey, "down", robotModifiers);
  },

  release(key: Key, modifiers?: ModifierKey | Array<ModifierKey>) {
    const robotKey = keyToRobot(key);
    const robotModifiers = modifiers
      ? Array.isArray(modifiers)
        ? modifiers.map(modifierKeyToRobot)
        : modifierKeyToRobot(modifiers)
      : undefined;

    callRobot("keyToggle", robotKey, "up", robotModifiers);
  },

  type(textToType: string, charactersPerMinute?: number) {
    if (charactersPerMinute != null) {
      callRobot("typeStringDelayed", textToType, charactersPerMinute);
    } else {
      callRobot("typeString", textToType);
    }
  },
};

export const Mouse = {
  moveTo(x: number, y: number, smooth: boolean = false) {
    if (smooth) {
      callRobot("moveMouseSmooth", x, y);
    } else {
      callRobot("moveMouse", x, y);
    }
  },
  click(button: MouseButton = MouseButton.LEFT) {
    const robotButton = mouseButtonToRobot(button);

    callRobot("mouseClick", robotButton);
  },
  doubleClick(button: MouseButton = MouseButton.LEFT) {
    const robotButton = mouseButtonToRobot(button);

    callRobot("mouseClick", robotButton, true);
  },
  hold(button: MouseButton = MouseButton.LEFT) {
    const robotButton = mouseButtonToRobot(button);

    callRobot("mouseToggle", "down", robotButton);
  },
  release(button: MouseButton = MouseButton.LEFT) {
    const robotButton = mouseButtonToRobot(button);

    callRobot("mouseToggle", "up", robotButton);
  },
  getPosition(): { x: number; y: number } {
    return callRobot("getMousePos");
  },
  scroll({ x = 0, y = 0 } = {}) {
    return callRobot("scrollMouse", x, y);
  },
};

export const Screen = {
  getSize(): { width: number; height: number } {
    return callRobot("getScreenSize");
  },
};
