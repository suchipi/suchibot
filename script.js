#!/usr/bin/env suchibot
import { Keyboard, Key } from "./index";

Keyboard.onDown(Key.A, (event) => {
  if (Keyboard.isDown(Key.LEFT_SHIFT)) {
    console.log("left shift a");
  }
  if (Keyboard.isDown(Key.RIGHT_SHIFT)) {
    console.log("right shift a");
  }
  if (Keyboard.isDown(Key.LEFT_SHIFT) || Keyboard.isDown(Key.RIGHT_SHIFT)) {
    console.log("(either left or right) shift a");
  }
});

// easier way to check modifier keys since they're commonly used:
Keyboard.onDown(Key.A, (event) => {
  if (event.modifierKeys.leftShift) {
    console.log("left shift a");
  }
  if (event.modifierKeys.rightShift) {
    console.log("right shift a");
  }
  if (event.modifierKeys.shift) {
    console.log("(either left or right) shift a");
  }
});
