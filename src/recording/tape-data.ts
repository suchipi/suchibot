#!/usr/bin/env suchibot
import { MouseEvent, KeyboardEvent, isMouseEvent } from "../input";

export type RecordedAction = {
  event: MouseEvent | KeyboardEvent;
  time: number;
};

export class TapeData {
  actions: Array<RecordedAction>;

  get length(): number {
    const { actions } = this;

    if (actions.length > 0) {
      const lastAction = actions[actions.length - 1];
      return lastAction.time;
    } else {
      return 0;
    }
  }

  constructor(actions: Array<RecordedAction>) {
    this.actions = actions;
  }

  static deserialize(data: SerializedTapeData) {
    const actions = data.actions.map((serializedAction) => {
      const { time, event } = serializedAction;

      return {
        time: time,
        event:
          event.$kind === "MouseEvent"
            ? new MouseEvent(event.type, event.button, event.x, event.y)
            : new KeyboardEvent(event.type, event.key),
      };
    });

    return new TapeData(actions);
  }

  serialize(): SerializedTapeData {
    return {
      $kind: "TapeData",
      actions: this.actions.map((action) => {
        const { time, event } = action;

        return {
          $kind: "RecordedAction",
          time,
          event: isMouseEvent(event)
            ? {
                $kind: "MouseEvent",
                type: event.type,
                button: event.button,
                x: event.x,
                y: event.y,
              }
            : {
                $kind: "KeyboardEvent",
                type: event.type,
                key: event.key,
              },
        };
      }),
    };
  }
}

export type SerializedMouseEvent = {
  $kind: "MouseEvent";
  type: MouseEvent["type"];
  button: MouseEvent["button"];
  x: number;
  y: number;
};

export type SerializedKeyboardEvent = {
  $kind: "KeyboardEvent";
  type: KeyboardEvent["type"];
  key: KeyboardEvent["key"];
};

export type SerializedTapeData = {
  $kind: "TapeData";
  actions: Array<{
    $kind: "RecordedAction";
    time: number;
    event: SerializedMouseEvent | SerializedKeyboardEvent;
  }>;
};
