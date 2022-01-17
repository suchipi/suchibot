import { Key, MouseButton } from "./types";
import * as nut from "@nut-tree/nut-js";
import { sleep } from "./sleep";

const keyToNutMap: { [key in keyof typeof Key]: number } = {
  BACKSPACE: nut.Key.Backspace,
  DELETE: nut.Key.Delete,
  ENTER: nut.Key.Enter,
  TAB: nut.Key.Tab,
  ESCAPE: nut.Key.Escape,
  UP: nut.Key.Up,
  DOWN: nut.Key.Down,
  RIGHT: nut.Key.Right,
  LEFT: nut.Key.Left,
  HOME: nut.Key.Home,
  END: nut.Key.End,
  PAGE_UP: nut.Key.PageUp,
  PAGE_DOWN: nut.Key.PageDown,
  F1: nut.Key.F1,
  F2: nut.Key.F2,
  F3: nut.Key.F3,
  F4: nut.Key.F4,
  F5: nut.Key.F5,
  F6: nut.Key.F6,
  F7: nut.Key.F7,
  F8: nut.Key.F8,
  F9: nut.Key.F9,
  F10: nut.Key.F10,
  F11: nut.Key.F11,
  F12: nut.Key.F12,
  F13: nut.Key.F13,
  F14: nut.Key.F14,
  F15: nut.Key.F15,
  F16: nut.Key.F16,
  F17: nut.Key.F17,
  F18: nut.Key.F18,
  F19: nut.Key.F19,
  F20: nut.Key.F20,
  F21: nut.Key.F21,
  F22: nut.Key.F22,
  F23: nut.Key.F23,
  F24: nut.Key.F24,

  LEFT_ALT: nut.Key.LeftAlt,
  RIGHT_ALT: nut.Key.RightAlt,

  LEFT_CONTROL: nut.Key.LeftControl,
  RIGHT_CONTROL: nut.Key.LeftControl,

  LEFT_SHIFT: nut.Key.LeftShift,
  RIGHT_SHIFT: nut.Key.RightShift,

  SPACE: nut.Key.Space,
  PRINT_SCREEN: nut.Key.Print,
  INSERT: nut.Key.Insert,
  VOLUME_DOWN: nut.Key.AudioVolDown,
  VOLUME_UP: nut.Key.AudioVolUp,
  MUTE: nut.Key.AudioMute,
  NUMPAD_0: nut.Key.NumPad0,
  NUMPAD_1: nut.Key.NumPad1,
  NUMPAD_2: nut.Key.NumPad2,
  NUMPAD_3: nut.Key.NumPad3,
  NUMPAD_4: nut.Key.NumPad4,
  NUMPAD_5: nut.Key.NumPad5,
  NUMPAD_6: nut.Key.NumPad6,
  NUMPAD_7: nut.Key.NumPad7,
  NUMPAD_8: nut.Key.NumPad8,
  NUMPAD_9: nut.Key.NumPad9,

  A: nut.Key.A,
  B: nut.Key.B,
  C: nut.Key.C,
  D: nut.Key.D,
  E: nut.Key.E,
  F: nut.Key.F,
  G: nut.Key.G,
  H: nut.Key.H,
  I: nut.Key.I,
  J: nut.Key.J,
  K: nut.Key.K,
  L: nut.Key.L,
  M: nut.Key.M,
  N: nut.Key.N,
  O: nut.Key.O,
  P: nut.Key.P,
  Q: nut.Key.Q,
  R: nut.Key.R,
  S: nut.Key.S,
  T: nut.Key.T,
  U: nut.Key.U,
  V: nut.Key.V,
  W: nut.Key.W,
  X: nut.Key.X,
  Y: nut.Key.Y,
  Z: nut.Key.Z,

  ZERO: nut.Key.Num0,
  ONE: nut.Key.Num1,
  TWO: nut.Key.Num2,
  THREE: nut.Key.Num3,
  FOUR: nut.Key.Num4,
  FIVE: nut.Key.Num5,
  SIX: nut.Key.Num6,
  SEVEN: nut.Key.Num7,
  EIGHT: nut.Key.Num8,
  NINE: nut.Key.Num9,

  ANY: -99999,

  CAPS_LOCK: nut.Key.CapsLock,
  NUMPAD_MULTIPLY: nut.Key.Multiply,
  NUMPAD_ADD: nut.Key.Add,
  NUMPAD_SUBTRACT: nut.Key.Subtract,
  NUMPAD_DECIMAL: nut.Key.Decimal,
  NUMPAD_DIVIDE: nut.Key.Divide,
  NUMPAD_ENTER: nut.Key.Enter,
  SEMICOLON: nut.Key.Semicolon,

  EQUAL: nut.Key.Equal,
  COMMA: nut.Key.Comma,
  MINUS: nut.Key.Minus,
  PERIOD: nut.Key.Period,
  SLASH: nut.Key.Slash,
  BACKTICK: nut.Key.Grave,
  LEFT_BRACKET: nut.Key.LeftBracket,
  BACKSLASH: nut.Key.Backslash,
  RIGHT_BRACKET: nut.Key.RightBracket,
  QUOTE: nut.Key.Quote,

  SCROLL_LOCK: nut.Key.ScrollLock,
  PAUSE_BREAK: nut.Key.Pause,
  NUM_LOCK: nut.Key.NumLock,

  LEFT_COMMAND: nut.Key.LeftSuper,
  LEFT_WINDOWS: nut.Key.LeftSuper,
  LEFT_SUPER: nut.Key.LeftSuper,
  LEFT_META: nut.Key.LeftSuper,

  RIGHT_COMMAND: nut.Key.LeftSuper,
  RIGHT_WINDOWS: nut.Key.LeftSuper,
  RIGHT_SUPER: nut.Key.LeftSuper,
  RIGHT_META: nut.Key.LeftSuper,
};

const mouseButtonToNutMap: { [key in keyof typeof MouseButton]: number } = {
  LEFT: nut.Button.LEFT,
  RIGHT: nut.Button.RIGHT,
  MIDDLE: nut.Button.MIDDLE,
  ANY: -99999,
};

function keyToNut(key: Key): number {
  if (key === Key.ANY) {
    throw new Error(
      `The "ANY" key is for input listeners only; it can't be pressed`
    );
  }

  const result = keyToNutMap[key];

  if (result == null) {
    throw new Error("Invalid key: " + key);
  }
  return result;
}

function mouseButtonToNut(button: MouseButton): number {
  if (button === MouseButton.ANY) {
    throw new Error(
      `The "ANY" mouse button is for input listeners only; it can't be pressed`
    );
  }

  const result = mouseButtonToNutMap[button];
  if (result == null) {
    throw new Error("Invalid mouse button: " + button);
  }
  return result;
}

nut.keyboard.config.autoDelayMs = 10;

export const Keyboard = {
  tap(key: Key) {
    const nutKey = keyToNut(key);
    nut.keyboard.pressKey(nutKey).then(() => {
      sleep(10).then(() => {
        nut.keyboard.releaseKey(nutKey);
      });
    });
  },

  hold(key: Key) {
    const nutKey = keyToNut(key);
    nut.keyboard.pressKey(nutKey);
  },

  release(key: Key) {
    const nutKey = keyToNut(key);
    nut.keyboard.releaseKey(nutKey);
  },

  type(textToType: string, delayBetweenKeyPresses: number = 10) {
    nut.keyboard.config.autoDelayMs = delayBetweenKeyPresses;
    nut.keyboard.type(textToType);
  },
};

export const Mouse = {
  moveTo(x: number, y: number) {
    nut.mouse.move([new nut.Point(x, y)]);
  },
  click(button: MouseButton = MouseButton.LEFT) {
    const nutButton = mouseButtonToNut(button);

    nut.mouse
      .pressButton(nutButton)
      .then(() => {
        return sleep(4);
      })
      .then(() => {
        return nut.mouse.releaseButton(nutButton);
      });
  },
  doubleClick(button: MouseButton = MouseButton.LEFT) {
    const nutButton = mouseButtonToNut(button);

    nut.mouse
      .pressButton(nutButton)
      .then(() => {
        return sleep(4);
      })
      .then(() => {
        return nut.mouse.releaseButton(nutButton);
      })
      .then(() => {
        return sleep(4);
      })
      .then(() => {
        return nut.mouse.pressButton(nutButton);
      })
      .then(() => {
        return sleep(4);
      })
      .then(() => {
        return nut.mouse.releaseButton(nutButton);
      });
  },
  hold(button: MouseButton = MouseButton.LEFT) {
    const nutButton = mouseButtonToNut(button);

    nut.mouse.pressButton(nutButton);
  },
  release(button: MouseButton = MouseButton.LEFT) {
    const nutButton = mouseButtonToNut(button);

    nut.mouse.releaseButton(nutButton);
  },
  async getPosition(): Promise<{ x: number; y: number }> {
    return nut.mouse.getPosition();
  },
  scroll({ x = 0, y = 0 } = {}) {
    let first: () => Promise<any> = () => Promise.resolve();
    let second: () => Promise<any> = () => Promise.resolve();

    if (x != 0) {
      if (x < 0) {
        first = () => nut.mouse.scrollLeft(Math.abs(x));
      } else {
        first = () => nut.mouse.scrollRight(x);
      }
    }

    if (y != 0) {
      if (y < 0) {
        second = () => nut.mouse.scrollUp(Math.abs(x));
      } else {
        second = () => nut.mouse.scrollDown(x);
      }
    }

    first().then(second);
  },
};

export const Screen = {
  async getSize(): Promise<{ width: number; height: number }> {
    const [width, height] = await Promise.all([
      nut.screen.width(),
      nut.screen.height(),
    ]);
    return { width, height };
  },
};
