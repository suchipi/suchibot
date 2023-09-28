import { Keyboard, Key, Tape } from "..";

let tape: Tape | null = null;

Keyboard.onUp(Key.SCROLL_LOCK, () => {
  if (tape && tape.state === Tape.State.RECORDING) {
    tape.stopRecording();
    console.log("Stopped recording");
  } else {
    if (tape) tape.stopPlaying();
    tape = new Tape([
      {
        filterType: "Keyboard",
        key: Key.SCROLL_LOCK,
      },
      {
        filterType: "Keyboard",
        key: Key.PAUSE_BREAK,
      },
    ]);
    console.log("Recording to tape...");
  }
});

let shouldLoop = false;
Keyboard.onUp(Key.PAUSE_BREAK, async () => {
  shouldLoop = !shouldLoop;
  console.log("shouldLoop:", shouldLoop);
});

Keyboard.onUp(Key.PAUSE_BREAK, async () => {
  if (!tape) return;

  if (tape.state === Tape.State.PLAYING) {
    await tape.stopPlaying();
  }
  if (tape.state === Tape.State.RECORDING) {
    await tape.stopRecording();
  }

  console.log("Playing tape...");
  await tape.play();
  console.log("Tape playback finished");

  while (shouldLoop) {
    console.log("Replaying tape...");
    await tape.play();
    console.log("Tape playback finished");
  }
});

console.log("Recording system ready. Controls:");
console.log("  Scroll Lock: Start/stop recording");
console.log("  Pause/break: Toggle replaying recording");
