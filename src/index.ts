import * as input from "./input";
import * as output from "./output";

import { Key, MouseButton } from "./types";
import {
  MouseEvent,
  KeyboardEvent,
  KeyboardModifierKeysState,
  MouseButtonsState,
  isKeyboardEvent,
  isMouseEvent,
  startListening,
  stopListening,
} from "./input";
import {
  Tape,
  SerializedTape,
  KeyboardEventFilter,
  MouseEventFilter,
  eventMatchesFilter,
  keyboardEventFilter,
  mouseEventFilter,
} from "./recording";
import { Screen } from "./screen";

const Mouse = {
  ...output.Mouse,
  ...input.Mouse,
};

const Keyboard = {
  ...output.Keyboard,
  ...input.Keyboard,
};

import { sleep as mimir } from "a-mimir";

// This is callable for backwards-compatibility. sleep.async or sleep.sync is preferred over calling this directly
const sleep = Object.assign(
  (milliseconds: number) => mimir.async(milliseconds),
  mimir
);

// sleep.sync is preferred, but this is here for backwards-compatibility
const sleepSync = mimir.sync;

// prettier-ignore
export {
  Mouse,
  Keyboard,

  MouseButton,
  Key,

  MouseEvent,
  KeyboardEvent,
  KeyboardModifierKeysState,
  MouseButtonsState,
  isKeyboardEvent,
  isMouseEvent,
  
  sleep,
  sleepSync,
  
  Screen,
  
  startListening,
  stopListening,

  KeyboardEventFilter,
  MouseEventFilter,
  eventMatchesFilter,
  keyboardEventFilter,
  mouseEventFilter,

  Tape,
  SerializedTape,
};
