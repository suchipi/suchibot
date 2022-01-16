import * as input from "./input";
import * as output from "./output";

export { Key, ModifierKey, MouseButton } from "./types";
export { MouseEvent, KeyboardEvent } from "./input";

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

export const sleepSync = (milliseconds: number) => {
  const target = Date.now() + milliseconds;
  while (Date.now() < target) {
    // haha, cpu go brrr
  }
};

export const sleep = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
