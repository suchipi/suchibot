#!/usr/bin/env suchibot
import {
  MouseEvent,
  KeyboardEvent,
  isMouseEvent,
  isKeyboardEvent,
} from "../input";

export type MouseEventFilter = {
  filterType: "Mouse";
  type?: MouseEvent["type"];
  button?: MouseEvent["button"];
  x?: number;
  y?: number;
};

export type KeyboardEventFilter = {
  filterType: "Keyboard";
  type?: KeyboardEvent["type"];
  key?: KeyboardEvent["key"];
};

export function mouseEventFilter(
  criteria: Omit<MouseEventFilter, "filterType"> = {}
): MouseEventFilter {
  return {
    filterType: "Mouse",
    ...criteria,
  };
}

export function keyboardEventFilter(
  criteria: Omit<KeyboardEventFilter, "filterType"> = {}
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

  if (filter.button != null) {
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

  if (filter.key != null) {
    doesMatch = doesMatch && filter.key === event.key;
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
