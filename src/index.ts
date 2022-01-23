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

export {
  Mouse,
  Keyboard,
  Key,
  MouseButton,
  MouseEvent,
  KeyboardEvent,
  isKeyboardEvent,
  isMouseEvent,
  sleep,
  sleepSync,
  Tape,
  Screen,
  startListening,
  stopListening,
  SerializedTape,
  KeyboardEventFilter,
  MouseEventFilter,
  eventMatchesFilter,
  keyboardEventFilter,
  mouseEventFilter,
};
