import robot from "robotjs";

// TODO: change to enum once kame can do typescript enums (kame uses @babel/preset-typescript)
export type Key = string & { __type__: "Key" };
export const Key = {
  backspace: "backspace" as Key,
  delete: "delete" as Key,
  enter: "enter" as Key,
  tab: "tab" as Key,
  escape: "escape" as Key,
  up: "up" as Key,
  down: "down" as Key,
  right: "right" as Key,
  left: "left" as Key,
  home: "home" as Key,
  end: "end" as Key,
  pageup: "pageup" as Key,
  pagedown: "pagedown" as Key,
  f1: "f1" as Key,
  f2: "f2" as Key,
  f3: "f3" as Key,
  f4: "f4" as Key,
  f5: "f5" as Key,
  f6: "f6" as Key,
  f7: "f7" as Key,
  f8: "f8" as Key,
  f9: "f9" as Key,
  f10: "f10" as Key,
  f11: "f11" as Key,
  f12: "f12" as Key,
  command: "command" as Key,
  alt: "alt" as Key,
  control: "control" as Key,
  shift: "shift" as Key,
  right_shift: "right_shift" as Key,
  space: "space" as Key,
  printscreen: "printscreen" as Key,
  insert: "insert" as Key,
  audio_mute: "audio_mute" as Key,
  audio_vol_down: "audio_vol_down" as Key,
  audio_vol_up: "audio_vol_up" as Key,
  audio_play: "audio_play" as Key,
  audio_stop: "audio_stop" as Key,
  audio_pause: "audio_pause" as Key,
  audio_prev: "audio_prev" as Key,
  audio_next: "audio_next" as Key,
  audio_rewind: "audio_rewind" as Key,
  audio_forward: "audio_forward" as Key,
  audio_repeat: "audio_repeat" as Key,
  audio_random: "audio_random" as Key,
  numpad_0: "numpad_0" as Key,
  numpad_1: "numpad_1" as Key,
  numpad_2: "numpad_2" as Key,
  numpad_3: "numpad_3" as Key,
  numpad_4: "numpad_4" as Key,
  numpad_5: "numpad_5" as Key,
  numpad_6: "numpad_6" as Key,
  numpad_7: "numpad_7" as Key,
  numpad_8: "numpad_8" as Key,
  numpad_9: "numpad_9" as Key,
  lights_mon_up: "lights_mon_up" as Key,
  lights_mon_down: "lights_mon_down" as Key,
  lights_kbd_toggle: "lights_kbd_toggle" as Key,
  lights_kbd_up: "lights_kbd_up" as Key,
  lights_kbd_down: "lights_kbd_down" as Key,
};

export type ModifierKey = string & { __type__: "ModifierKey" };
export const ModifierKey = {
  alt: "alt" as ModifierKey,
  command: "command" as ModifierKey,
  win: "win" as ModifierKey,
  control: "control" as ModifierKey,
  shift: "shift" as ModifierKey,
};

export type MouseButton = string & { __type__: "MouseButton" };
export const MouseButton = {
  left: "left" as MouseButton,
  right: "right" as MouseButton,
  middle: "middle" as MouseButton,
};

export const Keyboard = {
  tap(key: Key, modifiers?: ModifierKey | Array<ModifierKey>) {
    robot.keyTap(key, modifiers);
  },

  hold(key: Key, modifiers?: ModifierKey | Array<ModifierKey>) {
    robot.keyToggle(key, "down", modifiers);
  },

  release(key: Key, modifiers?: ModifierKey | Array<ModifierKey>) {
    robot.keyToggle(key, "up", modifiers);
  },

  type(textToType: string, charactersPerMinute?: number) {
    if (charactersPerMinute != null) {
      robot.typeStringDelayed(textToType, charactersPerMinute);
    } else {
      robot.typeString(textToType);
    }
  },
};

export const Mouse = {
  moveTo(x: number, y: number, smooth: boolean = false) {
    if (smooth) {
      robot.moveMouseSmooth(x, y);
    } else {
      robot.moveMouse(x, y);
    }
  },
  click(button: MouseButton = MouseButton.left) {
    robot.mouseClick(button);
  },
  doubleClick(button: MouseButton = MouseButton.left) {
    robot.mouseClick(button, true);
  },
  hold(button: MouseButton = MouseButton.left) {
    robot.mouseToggle("down", button);
  },
  release(button: MouseButton = MouseButton.left) {
    robot.mouseToggle("up", button);
  },
  getPosition(): { x: number; y: number } {
    return robot.getMousePos();
  },
  scroll({ x = 0, y = 0 } = {}) {
    robot.scrollMouse(x, y);
  },
};

export const Screen = {
  getSize(): { width: number; height: number } {
    return robot.getScreenSize();
  },
};
