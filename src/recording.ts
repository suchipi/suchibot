#!/usr/bin/env suchibot
import * as input from "./input";
import * as output from "./output";
import { Listener, MouseButton, Key } from "./types";

type RecordedAction = {
  event: input.MouseEvent | input.KeyboardEvent;
  time: number;
};

export type Recording = {
  stop(): void;
  replay(): void;
};

export function record(): Recording {
  const actions: Array<RecordedAction> = [];

  const start = Date.now();

  function pushEvent(event: input.MouseEvent | input.KeyboardEvent) {
    actions.push({ event, time: Date.now() - start });
  }

  const listeners: Array<Listener> = [
    input.Mouse.onClick(MouseButton.ANY, pushEvent),
    input.Mouse.onDown(MouseButton.ANY, pushEvent),
    input.Mouse.onUp(MouseButton.ANY, pushEvent),
    input.Mouse.onMove(pushEvent),

    input.Keyboard.onDown(Key.ANY, pushEvent),
    input.Keyboard.onUp(Key.ANY, pushEvent),
  ];

  let isDone = false;

  return {
    replay() {
      if (!isDone) {
        throw new Error(
          "You must call `.stop()` on your recording before replaying it."
        );
      }

      for (const action of actions) {
        const { event, time } = action;
        setTimeout(() => {
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
        }, time);
      }
    },
    stop() {
      if (isDone) return;

      for (const listener of listeners) {
        listener.stop();
      }

      isDone = true;
    },
  };
}
