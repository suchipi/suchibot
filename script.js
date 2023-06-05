#!/usr/bin/env suchibot
import {
  Keyboard,
  Key,
  Tape,
  keyboardEventFilter,
  eventMatchesFilter,
} from "./index";

const filter = keyboardEventFilter({
  type: "down",
  key: Key.A,
  modifierKeys: {
    shift: true,
  },
});

Keyboard.onDown(Key.ANY, (event) => {
  if (eventMatchesFilter(event, filter)) {
    console.log("Shift A down!");
  }
});
