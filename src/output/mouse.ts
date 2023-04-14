import { MouseButton } from "../types";
import * as libnut from "@nut-tree/libnut";
import { sleepSync } from "../sleep";

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
