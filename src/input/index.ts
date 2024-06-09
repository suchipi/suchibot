import { uIOhook } from "uiohook-napi";
import { Mouse, MouseEvent, isMouseEvent } from "./mouse";
import { MouseButtonsState } from "./held-mouse-buttons";
import { Keyboard, KeyboardEvent, isKeyboardEvent } from "./keyboard";
import { KeyboardModifierKeysState } from "./held-keys";
import makeDebug from "debug";

const debug = makeDebug("suchibot:input/index");

export {
  Mouse,
  MouseEvent,
  MouseButtonsState,
  isMouseEvent,
  Keyboard,
  KeyboardEvent,
  KeyboardModifierKeysState,
  isKeyboardEvent,
};

export function startListening() {
  debug("startListening()");
  uIOhook.start();
}

export function stopListening() {
  debug("stopListening()");
  uIOhook.stop();
}
