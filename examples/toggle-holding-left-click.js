import { Keyboard, Key, Mouse, MouseButton } from "suchibot";

// This script toggles whether the left mouse button is being held whenever you press scroll lock.
// I use it to hold down left-click in Minecraft so I can keep mining cobblestone from the cobblestone generator :3

let shouldHold = false;

Keyboard.onUp(Key.SCROLL_LOCK, () => {
  shouldHold = !shouldHold;

  if (shouldHold) {
    Mouse.hold(MouseButton.LEFT);
  } else {
    Mouse.release(MouseButton.LEFT);
  }
});
