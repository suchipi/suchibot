import * as input from "./input";
import * as output from "./output";

import { Key, MouseButton } from "./types";
import {
  MouseEvent,
  KeyboardEvent,
  isKeyboardEvent,
  isMouseEvent,
  startListening,
  stopListening,
} from "./input";
import { sleep, sleepSync } from "./sleep";
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

// prettier-ignore
export {
  Mouse,
  Keyboard,

  MouseButton,
  Key,

  MouseEvent,
  KeyboardEvent,
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
