import { uIOhook } from "uiohook-napi";
import { Mouse, MouseEvent, isMouseEvent } from "./mouse";
import { Keyboard, KeyboardEvent, isKeyboardEvent } from "./keyboard";

export {
  Mouse,
  MouseEvent,
  isMouseEvent,
  Keyboard,
  KeyboardEvent,
  isKeyboardEvent,
};

export function startListening() {
  uIOhook.start();
}

export function stopListening() {
  uIOhook.stop();
}
