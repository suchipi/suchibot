#!/usr/bin/env suchibot
import * as kleur from "kleur";
import * as input from "./input";
import * as output from "./output";
import { Listener, MouseButton, Key } from "./types";
import { sleep } from "./sleep";
import { formatError } from "./format-error";

class Defer<T> {
  // @ts-ignore
  resolve: (value: T) => void;
  // @ts-ignore
  reject: (err: any) => void;
  promise: Promise<T>;

  constructor() {
    this.promise = new Promise<T>((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });
  }
}

type RecordedAction = {
  event: input.MouseEvent | input.KeyboardEvent;
  time: number;
};

export type Tape = {
  stop(): void;
  play(): Promise<void>;
  readonly isRecording: boolean;
  readonly isPlaying: boolean;
  readonly length: number;
};

type RecordOptions = {
  eventFilter?: (event: input.MouseEvent | input.KeyboardEvent) => boolean;
};
export function record({ eventFilter }: RecordOptions = {}): Tape {
  const actions: Array<RecordedAction> = [];

  const start = Date.now();

  function pushEvent(event: input.MouseEvent | input.KeyboardEvent) {
    let shouldPush = true;
    if (eventFilter != null) {
      shouldPush = eventFilter(event);
    }

    if (shouldPush) {
      actions.push({ event, time: Date.now() - start });
    }
  }

  const listeners: Array<Listener> = [
    input.Mouse.onClick(MouseButton.ANY, pushEvent),
    input.Mouse.onDown(MouseButton.ANY, pushEvent),
    input.Mouse.onUp(MouseButton.ANY, pushEvent),
    input.Mouse.onMove(pushEvent),

    input.Keyboard.onDown(Key.ANY, pushEvent),
    input.Keyboard.onUp(Key.ANY, pushEvent),
  ];

  let isRecording = true;
  let isPlaying = false;
  let length = -1;

  let playingDefer: Defer<void> | null = null;

  let timeouts = new Set<ReturnType<typeof setTimeout>>();

  const tape = {
    get isRecording() {
      return isRecording;
    },

    get isPlaying() {
      return isPlaying;
    },

    get length() {
      return length;
    },

    play(): Promise<void> {
      if (isRecording) {
        throw new Error(
          "This Tape is still recording; you must call `.stop()` before playing it."
        );
      }

      if (isPlaying) {
        throw new Error(
          "This Tape is still playing; you must call `.stop()` before playing it again."
        );
      }

      for (const action of actions) {
        const { event, time } = action;
        const timeout = setTimeout(() => {
          try {
            timeouts.delete(timeout);

            if (input.isMouseEvent(event)) {
              switch (event.type) {
                case "click": {
                  output.Mouse.click(event.button!);
                  break;
                }
                case "down": {
                  output.Mouse.hold(event.button!);
                  break;
                }
                case "up": {
                  output.Mouse.release(event.button!);
                  break;
                }
                case "move": {
                  output.Mouse.moveTo(event.x, event.y);
                  break;
                }
              }
            } else if (input.isKeyboardEvent(event)) {
              switch (event.type) {
                case "down": {
                  output.Keyboard.hold(event.key);
                  break;
                }
                case "up": {
                  output.Keyboard.release(event.key);
                  break;
                }
              }
            }
          } catch (err) {
            console.log(
              kleur.yellow(
                "An error was thrown while processing a recorded action:"
              )
            );
            console.log(formatError(err));
            console.log(
              kleur.yellow(
                "Playback of future recorded actions will continue despite the error."
              )
            );
          }
        }, time);

        timeouts.add(timeout);
      }

      isPlaying = true;

      playingDefer = new Defer<void>();

      const afterSleep = () => {
        isPlaying = false;
        timeouts = new Set<ReturnType<typeof setTimeout>>();
      };

      sleep(length + 2)
        .then(afterSleep, afterSleep)
        .then(playingDefer.resolve, playingDefer.reject);

      return playingDefer.promise;
    },
    stop() {
      if (isPlaying) {
        for (const timeout of timeouts) {
          clearTimeout(timeout);
        }
      }

      timeouts = new Set<ReturnType<typeof setTimeout>>();

      if (isRecording) {
        length = Date.now() - start;
        for (const listener of listeners) {
          listener.stop();
        }
      }

      if (playingDefer != null) {
        playingDefer.reject(new Error("Playback cancelled by `stop` call"));
        playingDefer = null;
      }

      isPlaying = false;
      isRecording = false;
    },
  };

  return tape;
}
