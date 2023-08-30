import { MouseButton, Listener } from "../types";
import { uIOhook } from "uiohook-napi";
import mitt, { Emitter } from "mitt";
import { getModifierKeysState, KeyboardModifierKeysState } from "./held-keys";
import {
  setButtonState,
  isButtonDown,
  isButtonUp,
  getMouseButtonsState,
  MouseButtonsState,
} from "./held-mouse-buttons";

// ------------ mouse stuff -------------
const IS_MOUSE_EVENT = Symbol("IS_MOUSE_EVENT");

export function isMouseEvent(event: any): event is MouseEvent {
  return typeof event === "object" && event != null && event[IS_MOUSE_EVENT];
}

export class MouseEvent {
  type: "click" | "down" | "up" | "move";
  button: MouseButton | null;
  x: number;
  y: number;
  modifierKeys: KeyboardModifierKeysState;
  mouseButtons: MouseButtonsState;
  [IS_MOUSE_EVENT]: true;

  constructor(
    type: "click" | "down" | "up" | "move",
    button: MouseButton | null,
    x: number,
    y: number,
    modifierKeys: KeyboardModifierKeysState = getModifierKeysState(),
    mouseButtons: MouseButtonsState = getMouseButtonsState()
  ) {
    this.type = type;
    this.button = button;
    this.x = x;
    this.y = y;
    this.modifierKeys = modifierKeys;
    this.mouseButtons = mouseButtons;
    this[IS_MOUSE_EVENT] = true;
  }
}

const uioToMouseButtonMap = {
  1: MouseButton.LEFT,
  2: MouseButton.MIDDLE,
  3: MouseButton.RIGHT,
  4: MouseButton.MOUSE4,
  5: MouseButton.MOUSE5,
};

function uioToMouseButton(uioButton: number): MouseButton | null {
  return uioToMouseButtonMap[uioButton] || null;
}

// ------------ event emitter setup -------------
const events: Emitter<{
  mousedown: MouseEvent;
  mouseup: MouseEvent;
  mousemove: MouseEvent;
  click: MouseEvent;
}> = mitt();

uIOhook.on("click", (event) => {
  const button = uioToMouseButton(event.button as number);
  if (!button) {
    console.warn(
      "WARNING: received click for unsupported mouse button:",
      event.button
    );
    return;
  }

  setButtonState(button, "up");

  const newEvent = new MouseEvent("click", button, event.x, event.y);
  events.emit("click", newEvent);
});

uIOhook.on("mousedown", (event) => {
  const button = uioToMouseButton(event.button as number);
  if (!button) {
    console.warn(
      "WARNING: received mousedown for unsupported mouse button:",
      event.button
    );
    return;
  }

  setButtonState(button, "down");

  const newEvent = new MouseEvent("down", button, event.x, event.y);
  events.emit("mousedown", newEvent);
});

uIOhook.on("mouseup", (event) => {
  const button = uioToMouseButton(event.button as number);
  if (!button) {
    console.warn(
      "WARNING: received mouseup for unsupported mouse button:",
      event.button
    );
    return;
  }

  setButtonState(button, "up");

  const newEvent = new MouseEvent("up", button, event.x, event.y);
  events.emit("mouseup", newEvent);
});

uIOhook.on("mousemove", (event) => {
  const newEvent = new MouseEvent("move", null, event.x, event.y);
  events.emit("mousemove", newEvent);
});

// ------------ public API -------------
export const Mouse = {
  onDown(
    button: MouseButton,
    eventHandler: (event: MouseEvent) => void
  ): Listener {
    const callback = (event: MouseEvent) => {
      if (
        String(event.button) === String(button) ||
        String(button) === String(MouseButton.ANY)
      ) {
        eventHandler(event);
      }
    };
    events.on("mousedown", callback);
    return {
      stop() {
        events.off("mousedown", callback);
      },
    };
  },
  onUp(
    button: MouseButton,
    eventHandler: (event: MouseEvent) => void
  ): Listener {
    const callback = (event: MouseEvent) => {
      if (
        String(event.button) === String(button) ||
        String(button) === String(MouseButton.ANY)
      ) {
        eventHandler(event);
      }
    };
    events.on("mouseup", callback);
    return {
      stop() {
        events.off("mouseup", callback);
      },
    };
  },
  onClick(
    button: MouseButton,
    eventHandler: (event: MouseEvent) => void
  ): Listener {
    const callback = (event: MouseEvent) => {
      if (
        String(event.button) === String(button) ||
        String(button) === String(MouseButton.ANY)
      ) {
        eventHandler(event);
      }
    };
    events.on("click", callback);
    return {
      stop() {
        events.off("click", callback);
      },
    };
  },
  onMove(eventHandler: (event: MouseEvent) => void): Listener {
    const callback = (event: MouseEvent) => {
      eventHandler(event);
    };
    events.on("mousemove", callback);
    return {
      stop() {
        events.off("mousemove", callback);
      },
    };
  },

  isDown(button: MouseButton) {
    return isButtonDown(button);
  },

  isUp(button: MouseButton) {
    return isButtonUp(button);
  },
};
