#!/usr/bin/env suchibot
import { Keyboard, Key, Mouse, MouseButton, stopListening } from ".";

function something(): string {
  return "hi";
}

console.log("hi mom");

setTimeout(() => {
  Keyboard.type("hi there");
}, 100);

// setTimeout(() => {
//   console.log("stopListening");
//   stopListening();
// }, 2000);

Keyboard.onDown(Key.A, (event) => {
  console.log("got keydown a 1");

  // if (Keyboard.isDown(Key.LEFT_SHIFT)) {
  //   console.log("left shift a");
  // }
  // if (Keyboard.isDown(Key.RIGHT_SHIFT)) {
  //   console.log("right shift a");
  // }
  // if (Keyboard.isDown(Key.LEFT_SHIFT) || Keyboard.isDown(Key.RIGHT_SHIFT)) {
  //   console.log("(either left or right) shift a");
  // }

  // console.log("left mb down:", Mouse.isDown(MouseButton.LEFT));
});

// easier way to check modifier keys since they're commonly used:
Keyboard.onDown(Key.A, (event) => {
  console.log("got keydown a 2");

  // if (event.modifierKeys.leftShift) {
  //   console.log("left shift a");
  // }
  // if (event.modifierKeys.rightShift) {
  //   console.log("right shift a");
  // }
  // if (event.modifierKeys.shift) {
  //   console.log("(either left or right) shift a");
  // }

  // console.log("left mb down:", event.mouseButtons.left);
});
