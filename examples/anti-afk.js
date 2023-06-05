import { Keyboard, Key, sleep } from "..";

// This script presses "A" or "D" every 5 minutes,
// To prevent your character from getting kicked from a game for being AFK.

// DELAY is in milliseconds, and there's 60 seconds in a minute, and we want a delay of 5 minutes
const DELAY = 5 * 60 * 1000;

while (true) {
  Keyboard.tap(Key.A);
  sleep.sync(DELAY);
  Keyboard.tap(Key.D);
  sleep.sync(DELAY);
}
