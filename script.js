import { Keyboard, Mouse, Key, MouseButton, sleep } from "./index";

Keyboard.onDown(Key.SCROLL_LOCK, () => {
  Keyboard.tap(Key.NUMPAD_1);
});
