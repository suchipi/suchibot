import { SerializedTapeData, TapeData } from "./tape-data";
import { TapePlayer } from "./tape-player";
import { TapeRecorder } from "./tape-recorder";
import { KeyboardEventFilter, MouseEventFilter } from "./event-filters";

const DATA = Symbol("DATA");
const CURRENT_STATE = Symbol("CURRENT_STATE");
const EVENTS_TO_IGNORE = Symbol("EVENTS_TO_IGNORE");
const RECORDER = Symbol("RECORDER");
const PLAYER = Symbol("PLAYER");

type TapeState = string & { __type: "TapeState" };
const TapeState = {
  RECORDING: "RECORDING" as TapeState,
  PLAYING: "PLAYING" as TapeState,
  IDLE: "IDLE" as TapeState,
};

export type SerializedTape = {
  $kind: "Tape";
  eventsToIgnore: Array<KeyboardEventFilter | MouseEventFilter>;
  data: SerializedTapeData;
};

export class Tape {
  static State = TapeState;

  private [DATA]: TapeData;
  private [CURRENT_STATE]: TapeState = TapeState.IDLE;
  private [EVENTS_TO_IGNORE]: Array<KeyboardEventFilter | MouseEventFilter>;

  private [RECORDER]: TapeRecorder;
  private [PLAYER]: TapePlayer;

  constructor(
    eventsToIgnore: Array<KeyboardEventFilter | MouseEventFilter> = [],
    data: TapeData = new TapeData([])
  ) {
    this[DATA] = data;
    this[EVENTS_TO_IGNORE] = eventsToIgnore;

    this[RECORDER] = new TapeRecorder(data, eventsToIgnore);
    this[PLAYER] = new TapePlayer(data);
  }

  get state(): TapeState {
    return this[CURRENT_STATE];
  }

  record() {
    if (this[CURRENT_STATE] === TapeState.RECORDING) {
      throw new Error(
        "Attempted to record to a tape that was already being recorded to. This isn't allowed."
      );
    }

    if (this[CURRENT_STATE] === TapeState.PLAYING) {
      throw new Error(
        "Attempted to record to a tape that was being played. This isn't allowed."
      );
    }

    this[RECORDER].start();
    this[CURRENT_STATE] = TapeState.RECORDING;
  }
  stopRecording() {
    if (this[CURRENT_STATE] !== TapeState.RECORDING) {
      throw new Error(
        "Attempted to stop recording a tape that wasn't being recorded to. This isn't allowed."
      );
    }

    this[RECORDER].finish();
    this[CURRENT_STATE] = TapeState.IDLE;
  }

  play(): Promise<void> {
    if (this[CURRENT_STATE] === TapeState.PLAYING) {
      throw new Error(
        "Attempted to play a tape that was already being played. This isn't allowed."
      );
    }

    if (this[CURRENT_STATE] === TapeState.RECORDING) {
      throw new Error(
        "Attempted to play a tape that was being recorded to. This isn't allowed."
      );
    }

    const promise = this[PLAYER].play();
    this[CURRENT_STATE] = TapeState.PLAYING;
    promise.then(() => {
      this[CURRENT_STATE] = TapeState.IDLE;
    });
    return promise;
  }
  stopPlaying() {
    if (this[CURRENT_STATE] !== TapeState.PLAYING) {
      throw new Error(
        "Attempted to stop playing a tape that wasn't being played. This isn't allowed."
      );
    }

    this[PLAYER].stop();
    this[CURRENT_STATE] = TapeState.IDLE;
  }

  serialize(): SerializedTape {
    return {
      $kind: "Tape",
      eventsToIgnore: this[EVENTS_TO_IGNORE],
      data: this[DATA].serialize(),
    };
  }

  static deserialize(serialized: SerializedTape): Tape {
    return new Tape(
      serialized.eventsToIgnore,
      TapeData.deserialize(serialized.data)
    );
  }
}
