import { uIOhook } from "uiohook-napi";
import { Mouse, MouseEvent, isMouseEvent } from "./mouse";
import {
  Keyboard,
  KeyboardEvent,
  KeyboardModifierKeysState,
  isKeyboardEvent,
} from "./keyboard";

export {
  Mouse,
  MouseEvent,
  isMouseEvent,
  Keyboard,
  KeyboardEvent,
  KeyboardModifierKeysState,
  isKeyboardEvent,
};

export function startListening() {
  uIOhook.start();
}

export function stopListening() {
  uIOhook.stop();
}
