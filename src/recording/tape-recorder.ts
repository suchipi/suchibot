import { MouseEvent, KeyboardEvent, Mouse, Keyboard } from "../input";
import {
  MouseEventFilter,
  KeyboardEventFilter,
  eventMatchesFilter,
} from "./event-filters";
import { TapeData } from "./tape-data";
import { MouseButton, Key, Listener } from "../types";

const DATA = Symbol("DATA");
const RECORDING_STARTED_AT = Symbol("RECORDING_STARTED_AT");
const EVENTS_TO_IGNORE = Symbol("EVENTS_TO_IGNORE");
const IS_RECORDING = Symbol("IS_RECORDING");
const PUSH_EVENT = Symbol("PUSH_EVENT");
const LISTENERS = Symbol("LISTENERS");
const STOP_LISTENING = Symbol("STOP_LISTENING");

export class TapeRecorder {
  get isRecording() {
    return this[IS_RECORDING];
  }

  private [IS_RECORDING]: boolean = false;
  private [DATA]: TapeData;
  private [RECORDING_STARTED_AT]: number = -1;
  private [EVENTS_TO_IGNORE]: Array<MouseEventFilter | KeyboardEventFilter>;
  private [LISTENERS]: Array<Listener> = [];

  constructor(
    data: TapeData,
    eventsToIgnore: Array<MouseEventFilter | KeyboardEventFilter>
  ) {
    this[DATA] = data;
    this[EVENTS_TO_IGNORE] = eventsToIgnore;
  }

  start(): void {
    if (this[IS_RECORDING]) {
      throw new Error(
        "Attempted to start a tape recorder that was already recording. This isn't allowed."
      );
    }

    this[RECORDING_STARTED_AT] = Date.now();

    const boundPushEvent = this[PUSH_EVENT].bind(this);
    this[LISTENERS] = [
      Mouse.onClick(MouseButton.ANY, boundPushEvent),
      Mouse.onDown(MouseButton.ANY, boundPushEvent),
      Mouse.onUp(MouseButton.ANY, boundPushEvent),
      Mouse.onMove(boundPushEvent),

      Keyboard.onDown(Key.ANY, boundPushEvent),
      Keyboard.onUp(Key.ANY, boundPushEvent),
    ];

    this[IS_RECORDING] = true;
  }

  private [PUSH_EVENT](event: MouseEvent | KeyboardEvent) {
    let shouldPush = true;

    for (const filter of this[EVENTS_TO_IGNORE]) {
      shouldPush = shouldPush && !eventMatchesFilter(event, filter);
    }

    if (shouldPush) {
      this[DATA].actions.push({
        event,
        time: Date.now() - this[RECORDING_STARTED_AT],
      });
    }
  }

  private [STOP_LISTENING]() {
    for (const listener of this[LISTENERS]) {
      listener.stop();
    }
    this[LISTENERS] = [];
  }

  finish(): void {
    if (!this[IS_RECORDING]) {
      throw new Error(
        "Attempted to stop a tape recorder that was already stopped. This isn't allowed."
      );
    }

    this[STOP_LISTENING]();
    this[IS_RECORDING] = false;
  }
}
