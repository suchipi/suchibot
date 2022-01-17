import * as input from "./input";
import * as output from "./output";

export { Key, MouseButton } from "./types";
export { MouseEvent, KeyboardEvent } from "./input";
export { sleep, sleepSync } from "./sleep";

export const Mouse = {
  ...output.Mouse,
  ...input.Mouse,
};

export const Keyboard = {
  ...output.Keyboard,
  ...input.Keyboard,
};

export const Screen = output.Screen;

export const startListening = input.startListening;
export const stopListening = input.stopListening;
