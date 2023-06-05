import { Keyboard, Key } from "suchibot";

// This script toggles whether the W key is being held whenever you press pause/break.
// I use it to toggle moving forward while in a boat in minecraft.

let shouldHold = false;

Keyboard.onUp(Key.PAUSE_BREAK, () => {
  shouldHold = !shouldHold;

  if (shouldHold) {
    Keyboard.hold(Key.W);
  } else {
    Keyboard.release(Key.W);
  }
});
