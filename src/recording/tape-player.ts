import kleur from "kleur";
import Defer from "@suchipi/defer";
import { formatError } from "pretty-print-error";
import * as input from "../input";
import * as output from "../output";
import { TapeData } from "./tape-data";

const DATA = Symbol("DATA");
const IS_PLAYING = Symbol("IS_PLAYING");
const TIMEOUTS = Symbol("TIMEOUTS");
const PLAYBACK_DEFER = Symbol("PLAYBACK_DEFER");

export class TapePlayer {
  get isPlaying() {
    return this[IS_PLAYING];
  }

  private [DATA]: TapeData;
  private [IS_PLAYING]: boolean = false;
  private [TIMEOUTS]: Set<ReturnType<typeof setTimeout>>;
  private [PLAYBACK_DEFER]: Defer<void> | null = null;

  constructor(data: TapeData) {
    this[DATA] = data;
    this[TIMEOUTS] = new Set();
  }

  play(): Promise<void> {
    if (this[IS_PLAYING]) {
      throw new Error(
        "Attempted to play a tape that was already playing. This is disallowed."
      );
    }

    for (const action of this[DATA].actions) {
      const { event, time } = action;
      const timeout = setTimeout(() => {
        try {
          this[TIMEOUTS].delete(timeout);

          if (input.isMouseEvent(event)) {
            switch (event.type) {
              case "click": {
                // We intentionally don't play these back, because the down/up events will do the same thing.
                // If we play both down/up and click events, we'll double-click for every single click.
                // output.Mouse.click(event.button!);
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
              "An error was thrown while playing back a recorded action:"
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

      this[TIMEOUTS].add(timeout);
    }

    this[IS_PLAYING] = true;

    const defer = new Defer<void>();
    this[PLAYBACK_DEFER] = defer;

    const afterSleep = () => {
      this[IS_PLAYING] = false;
      this[TIMEOUTS] = new Set<ReturnType<typeof setTimeout>>();
    };

    const timeToSleep = (this[DATA].length || 0) + 2;

    const sleepTimeout = setTimeout(defer.resolve, timeToSleep);
    this[TIMEOUTS].add(sleepTimeout);

    return defer.promise.then(afterSleep, afterSleep);
  }

  stop() {
    if (!this[IS_PLAYING]) {
      throw new Error(
        "Attempted to stop playing a tape that wasn't being played. This isn't allowed."
      );
    }

    for (const timeout of this[TIMEOUTS]) {
      clearTimeout(timeout);
      this[TIMEOUTS].delete(timeout);
    }

    const defer = this[PLAYBACK_DEFER];
    if (defer != null) {
      defer.reject(new Error("Playback cancelled by `stop` call"));
      this[PLAYBACK_DEFER] = null;
    }

    this[IS_PLAYING] = false;
  }
}
