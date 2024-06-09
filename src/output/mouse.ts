import { MouseButton } from "../types";
import * as libnut from "../libnut";
import { sleep } from "a-mimir";
import makeDebug from "debug";

const debug = makeDebug("suchibot:output/mouse");
const libNutDebug = makeDebug("suchibot:output/mouse/libnut");

const mouseButtonToNutMap: {
  [key in keyof typeof MouseButton]: string | null;
} = {
  LEFT: "left",
  RIGHT: "right",
  MIDDLE: "middle",
  MOUSE4: null,
  MOUSE5: null,

  ANY: null,
};

function mouseButtonToNut(button: MouseButton): string {
  if (button === MouseButton.ANY) {
    throw new Error(
      `The "ANY" mouse button is for input listeners only; it can't be pressed/released`
    );
  }

  const result = mouseButtonToNutMap[button];
  if (result == null) {
    throw new Error(
      "Pressing/releasing the following mouse button is not yet supported: " +
        button
    );
  }
  return result;
}

export const Mouse = {
  moveTo(x: number, y: number) {
    debug("Mouse.moveTo(%d, %d)", x, y);
    libNutDebug("libnut.moveMouse(%d, %d)", x, y);
    libnut.moveMouse(x, y);
  },
  click(button: MouseButton = MouseButton.LEFT) {
    debug("Mouse.click(%s)", button);
    const nutButton = mouseButtonToNut(button);

    libNutDebug("libnut.mouseToggle(down, %s)", nutButton);
    libnut.mouseToggle("down", nutButton);
    sleep.sync(4);
    libNutDebug("libnut.mouseToggle(up, %s)", nutButton);
    libnut.mouseToggle("up", nutButton);
  },
  doubleClick(button: MouseButton = MouseButton.LEFT) {
    debug("Mouse.doubleClick(%s)", button);
    const nutButton = mouseButtonToNut(button);

    libNutDebug("libnut.mouseToggle(down, %s)", nutButton);
    libnut.mouseToggle("down", nutButton);
    sleep.sync(4);
    libNutDebug("libnut.mouseToggle(up, %s)", nutButton);
    libnut.mouseToggle("up", nutButton);
    sleep.sync(4);
    libNutDebug("libnut.mouseToggle(down, %s)", nutButton);
    libnut.mouseToggle("down", nutButton);
    sleep.sync(4);
    libNutDebug("libnut.mouseToggle(up, %s)", nutButton);
    libnut.mouseToggle("up", nutButton);
  },
  hold(button: MouseButton = MouseButton.LEFT) {
    debug("Mouse.hold(%s)", button);
    const nutButton = mouseButtonToNut(button);

    libNutDebug("libnut.mouseToggle(down, %s)", nutButton);
    libnut.mouseToggle("down", nutButton);
  },
  release(button: MouseButton = MouseButton.LEFT) {
    debug("Mouse.release(%s)", button);
    const nutButton = mouseButtonToNut(button);

    libNutDebug("libnut.mouseToggle(up, %s)", nutButton);
    libnut.mouseToggle("up", nutButton);
  },
  getPosition(): { x: number; y: number } {
    debug("Mouse.getPosition called");
    libNutDebug("libnut.getMousePos called");
    const result = libnut.getMousePos();
    libNutDebug("libnut.getMousePos -> %o", result);
    debug("Mouse.getPosition -> %o", result);
    return result;
  },
  scroll({ x = 0, y = 0 } = {}) {
    if (debug.enabled) {
      debug("Mouse.getPosition(%o)", { x, y });
    }
    libNutDebug("libnut.scrollMouse(%d, %d)", x, y);
    libnut.scrollMouse(x, y);
  },
};
