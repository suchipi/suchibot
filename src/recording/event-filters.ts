import {
  MouseEvent,
  KeyboardEvent,
  KeyboardModifierKeysState,
  isMouseEvent,
  isKeyboardEvent,
} from "../input";
import { MouseButton, Key } from "../types";

export type MouseEventFilter = {
  filterType: "Mouse";
  type?: "click" | "down" | "up" | "move";
  button?: MouseButton;
  x?: number;
  y?: number;
};

export type KeyboardEventFilter = {
  filterType: "Keyboard";
  type?: "down" | "up";
  key?: Key;
  modifierKeys?: Partial<KeyboardModifierKeysState>;
};

export function mouseEventFilter(
  criteria: {
    type?: "click" | "down" | "up" | "move";
    button?: MouseButton;
    x?: number;
    y?: number;
  } = {}
): MouseEventFilter {
  return {
    filterType: "Mouse",
    ...criteria,
  };
}

export function keyboardEventFilter(
  criteria: {
    type?: "down" | "up";
    key?: Key;
    modifierKeys?: Partial<KeyboardModifierKeysState>;
  } = {}
): KeyboardEventFilter {
  return {
    filterType: "Keyboard",
    ...criteria,
  };
}

function mouseEventMatchesFilter(
  event: MouseEvent,
  filter: MouseEventFilter
): boolean {
  let doesMatch = true;

  if (filter.type != null) {
    doesMatch = doesMatch && filter.type === event.type;
  }

  if (filter.button != null && filter.button !== MouseButton.ANY) {
    doesMatch = doesMatch && filter.button === event.button;
  }

  if (filter.x != null) {
    doesMatch = doesMatch && filter.x === event.x;
  }

  if (filter.y != null) {
    doesMatch = doesMatch && filter.y === event.y;
  }

  return doesMatch;
}

function keyboardEventMatchesFilter(
  event: KeyboardEvent,
  filter: KeyboardEventFilter
): boolean {
  let doesMatch = true;

  if (filter.type != null) {
    doesMatch = doesMatch && filter.type === event.type;
  }

  if (filter.key != null && filter.key !== Key.ANY) {
    doesMatch = doesMatch && filter.key === event.key;
  }

  if (doesMatch && filter.modifierKeys != null) {
    for (const key in filter.modifierKeys) {
      if (Object.prototype.hasOwnProperty.call(filter.modifierKeys, key)) {
        doesMatch =
          doesMatch && event.modifierKeys[key] === filter.modifierKeys[key];

        if (!doesMatch) {
          break;
        }
      }
    }
  }

  return doesMatch;
}

export function eventMatchesFilter(
  event: MouseEvent | KeyboardEvent,
  filter: MouseEventFilter | KeyboardEventFilter
): boolean {
  if (isMouseEvent(event) && filter.filterType === "Mouse") {
    return mouseEventMatchesFilter(event, filter);
  } else if (isKeyboardEvent(event) && filter.filterType === "Keyboard") {
    return keyboardEventMatchesFilter(event, filter);
  } else {
    return false;
  }
}
