#!/usr/bin/env suchibot
import { Keyboard, Key, Tape, keyboardEventFilter } from "./index";

const tape = new Tape([
  keyboardEventFilter({ key: Key.SCROLL_LOCK }),
  keyboardEventFilter({ key: Key.PAUSE_BREAK }),
]);

Keyboard.onUp(Key.SCROLL_LOCK, () => {
  switch (tape.state) {
    case Tape.State.IDLE: {
      console.log("Recording...");
      tape.record();
      break;
    }
    case Tape.State.RECORDING: {
      console.log("Recording stopped...");
      tape.stopRecording();
      break;
    }
  }
});

Keyboard.onUp(Key.PAUSE_BREAK, async () => {
  switch (tape.state) {
    case Tape.State.IDLE: {
      console.log("Playing...");
      await tape.play();
      console.log("Playback finished");
      break;
    }
    case Tape.State.PLAYING: {
      console.log("Stopping playback...");
      tape.stopPlaying();
      break;
    }
  }
});

console.log("Recording system ready. Controls:");
console.log("  Scroll Lock: Start/stop recording");
console.log("  Pause/break: Replay recording");
