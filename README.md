# suchibot

A cross-platform AutoHotKey-like thing with JavaScript/TypeScript as its scripting language. Built on top of [`uiohook-napi`](https://npm.im/uiohook-napi) and [`nut.js`](https://github.com/nut-tree/nut.js).

## Installation

First, you'll need [node.js](https://nodejs.org/en/download/) installed. Suchibot should work with most versions of Node, but for best compatibility, you can install [version 18](https://nodejs.org/dist/latest-hydrogen/), which is what it was tested against.

On Windows, you'll also need to install the [Microsoft Visual C++ Redistributable](https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads).

If you're running Windows 10 N, you'll also need to install the [Media Feature Pack](https://support.microsoft.com/en-us/topic/media-feature-pack-for-windows-10-n-may-2020-ebbdf559-b84c-0fc2-bd51-e23c9f6a4439).

On Linux, you also need libXtst. You can get that on Ubuntu-based distros by running this in a terminal:

```
sudo apt install build-essential libxtst-dev
```

> NOTE: I haven't tested suchibot in wayland, only Xorg. It probably doesn't work in wayland.

On macOS, you also need XCode command-line tools. You can get that by running this in a terminal:

```
xcode-select --install
```

> NOTE: Nowadays in macOS, apps need permissions in order to monitor and simulate input. suchibot will automatically request them the first time it's run, but be aware that permission requesting is broken on macOS if you have System Integrity Protection disabled.
>
> You can run with env var "DEBUG" set to `suchibot:mac-permissions` to see log output relating to the permission requests.
>
> That said, it seems things aren't working reliably on macOS... I need to investigate this later...

Then, to install suchibot itself:

```
# cd to a folder where you want to keep your scripts, then:
npm install suchibot
```

## Usage (CLI)

Write your macro script in either JavaScript or TypeScript; for example:

```ts
import { Keyboard, Mouse, Key, MouseButton, sleep } from "suchibot";

Keyboard.onDown(Key.NUMPAD_0, async () => {
  Mouse.click(MouseButton.LEFT);
  await sleep.async(100);
  Keyboard.tap(Key.NINE);
});
```

Run `suchibot` with the path to your script:

```
$ npx suchibot ./myscript.js
```

It's recommended to use Visual Studio Code to write your script, as it will give you autocomplete for the functions and key names (since they have TypeScript types).

See the [examples folder](https://github.com/suchipi/suchibot/tree/main/examples) for some example scripts.

## Usage (Node API)

Import stuff from the suchibot library and set up macros however, then use `suchibot.startListening()` and `suchibot.stopListening()`:

```js
const suchibot = require("suchibot");

function pressNine() {
  suchibot.Keyboard.tap(suchibot.Key.NINE);
}

suchibot.Keyboard.onUp(suchibot.Key.ANY, (event) => {
  console.log("someone pressed:", event.key);
});

suchibot.startListening();

// and then, some time later:
suchibot.stopListening();
```

## Quick API Overview

```ts
import {
  Key,
  Keyboard,
  Mouse,
  MouseButton,
  Screen,
  sleep,
  Tape,
} from "suchibot";

// `Mouse` contains functions for capturing and simulating mouse events, eg:
Mouse.click(MouseButton.RIGHT);
Mouse.onClick(MouseButton.ANY, (event) => {
  console.log(event.button, "was clicked at", event.x, event.y);
});
Mouse.onMove((event) => {
  console.log("mouse moved to", event.x, event.y);
});

console.log(Mouse);
// {
//   moveTo: [Function: moveTo],
//   click: [Function: click],
//   doubleClick: [Function: doubleClick],
//   hold: [Function: hold],
//   release: [Function: release],
//   getPosition: [Function: getPosition],
//   scroll: [Function: scroll],
//   onDown: [Function: onDown],
//   onUp: [Function: onUp],
//   onClick: [Function: onClick],
//   onMove: [Function: onMove]
// }

// `Keyboard` contains functions for capturing and simulating keyboard events, eg:
Keyboard.tap(Key.A);
Keyboard.onUp(Key.ZERO, () => {
  console.log("someone pressed zero!");
});

console.log(Keyboard);
// {
//   tap: [Function: tap],
//   hold: [Function: hold],
//   release: [Function: release],
//   type: [Function: type],
//   onDown: [Function: onDown],
//   onUp: [Function: onUp]
// }

// `Key` contains constants that you pass into functions.
console.log(Key);
// {
//   BACKSPACE: "BACKSPACE",
//   DELETE: "DELETE",
//   ENTER: "ENTER",
//   ...and more
// }

// `MouseButton` contains constants that you pass into functions.
console.log(Key);
// {
//   LEFT: "LEFT",
//   RIGHT: "RIGHT",
//   MIDDLE: "MIDDLE",
//   ANY: "ANY"
// }

// `Screen` can give you info about the screen size, eg:
const { width, height } = await Screen.getSize();

console.log(Screen);
// { getSize: [Function: getSize] }

// `sleep.async` returns a Promise that resolves in the specified number of milliseconds. eg:
await sleep.async(100);

// `sleep.sync` blocks the main thread for the specified number of milliseconds. eg:
sleep.sync(100);

// `Tape`s records all the mouse/keyboard events that happen until you
// call `tape.stopRecording()`, and then you can replay the tape to simulate
// the same mouse/keyboard events.
const tape = new Tape();

// Start the recording...
tape.record();

// We'll take a 4-second recording by waiting 4000ms before calling `stopRecording`.
await sleep.async(4000);

// Move the mouse around, press keys, etc.

// Now, stop recording.
tape.stopRecording();

// Now, replay the tape, and the mouse and keyboard will do the same things you did during the 4000ms wait.
tape.play();
```

See the [examples folder](https://github.com/suchipi/suchibot/tree/main/examples) for some example scripts.

## Full API Documentation

The "suchibot" module has 17 named exports. Each is documented here.

### Mouse

Functions that let you control the mouse and/or register code to be run when a mouse event occurs.

#### Mouse.moveTo

Moves the mouse cursor to the specified position.

Definition:

```ts
function moveTo(x: number, y: number, smooth: boolean = false): void;
```

Example:

```js
Mouse.moveTo(100, 100);

// Moves smoothly over time rather than jumping to the spot immediately
Mouse.moveTo(100, 100, true);
```

#### Mouse.click

Clicks the specified mouse button.

If no mouse button is specified, clicks the left mouse button.

Definition:

```ts
function click(button: MouseButton = MouseButton.LEFT): void;
```

Example:

```js
Mouse.click();

// To specify a button other than the left button:
Mouse.click(MouseButton.RIGHT);
```

#### Mouse.doubleClick

Double-clicks the specified mouse button.

If no mouse button is specified, double-clicks the left mouse button.

Definition:

```ts
function doubleClick(button: MouseButton = MouseButton.LEFT): void;
```

Example:

```js
Mouse.doubleClick();

// To specify a button other than the left button:
Mouse.doubleClick(MouseButton.RIGHT);
```

#### Mouse.hold

Holds down the specified mouse button until you call `Mouse.release`.

If no mouse button is specified, holds the left mouse button.

Definition:

```ts
function hold(button: MouseButton = MouseButton.LEFT): void;
```

Example:

```js
Mouse.hold();
// and then, later...
Mouse.release();

// To specify a button other than the left button:
Mouse.hold(MouseButton.RIGHT);
```

#### Mouse.release

Stops holding down the specified mouse button, that was being held down because `Mouse.hold` was called, or the user was holding the button.

Definition:

```ts
function release(button: MouseButton = MouseButton.LEFT): void;
```

Example:

```js
Mouse.hold();
// and then, later...
Mouse.release();

// To specify a button other than the left button:
Mouse.release(MouseButton.RIGHT);
```

#### Mouse.getPosition

Returns an object with `x` and `y` properties referring to the current mouse cursor position on the screen.

Definition:

```ts
function getPosition(): { x: number; y: number };
```

Example:

```js
const position = Mouse.getPosition();
console.log(position); // { x: 100, y: 400 }
```

#### Mouse.scroll

Uses the mouse wheel or trackpad to scroll in the specified direction by the specified amount.

Definition:

```ts
function scroll({ x = 0, y = 0 } = {}): void;
```

Example:

```js
// Scroll down some:
Mouse.scroll({ y: 100 });

// Scroll down a lot:
Mouse.scroll({ y: 1000 });

// Scroll up:
Mouse.scroll({ y: -100 });

// Scroll right:
Mouse.scroll({ x: 100 });

// Scroll left:
Mouse.scroll({ x: -100 });

// Scroll diagonally:
Mouse.scroll({ x: 100, y: 100 });
```

#### Mouse.onDown

Registers a function to be called when a mouse button is pressed down.

Returns a `Listener` object; call `.stop()` on the listener to unregister the function, so it's no longer called when the mouse button is pressed down.

Definition:

```ts
function onDown(
  button: MouseButton,
  eventHandler: (event: MouseEvent) => void
): Listener;
```

Example:

```js
// log whenever mouse right button is pressed:
Mouse.onDown(MouseButton.RIGHT, (event) => {
  console.log("right mouse was pressed at", event.x, event.y);
});

// log whenever any mouse button is pressed:
Mouse.onDown(MouseButton.ANY, (event) => {
  console.log(event.button, "was pressed at", event.x, event.y);
});
```

#### Mouse.onUp

Registers a function to be called when a mouse button is released (stops being held down).

Returns a `Listener` object; call `.stop()` on the listener to unregister the function, so it's no longer called when the mouse button is released.

Definition:

```ts
function onUp(
  button: MouseButton,
  listener: (event: MouseEvent) => void
): Listener;
```

Example:

```js
// log whenever mouse right button is relseased:
Mouse.onUp(MouseButton.RIGHT, (event) => {
  console.log("right mouse was released at", event.x, event.y);
});

// log whenever any mouse button is released:
Mouse.onUp(MouseButton.ANY, (event) => {
  console.log(event.button, "was released at", event.x, event.y);
});
```

#### Mouse.onClick

Registers a function to be called when a mouse button is clicked (pressed and then released without moving around between the press and release).

Returns a `Listener` object; call `.stop()` on the listener to unregister the function, so it's no longer called when the mouse button is clicked.

Definition:

```ts
function onClick(
  button: MouseButton,
  eventHandler: (event: MouseEvent) => void
): void;
```

Example:

```js
// log whenever mouse right button is clicked:
Mouse.onClick(MouseButton.RIGHT, (event) => {
  console.log("right mouse was clicked at", event.x, event.y);
});

// log whenever any mouse button is clicked:
Mouse.onClick(MouseButton.ANY, (event) => {
  console.log(event.button, "was clicked at", event.x, event.y);
});
```

#### Mouse.onMove

Registers a function to be called whenever the mouse cursor is moved.

Returns a `Listener` object; call `.stop()` on the listener to unregister the function, so it's no longer called when the mouse is moved.

Definition:

```ts
function onMove(eventHandler: (event: MouseEvent) => void): Listener;
```

Example:

```js
// log whenever mouse is moved
Mouse.onMove((event) => {
  console.log("mouse moved to:", event.x, event.y);
});
```

#### Mouse.isDown

Returns whether the specified mouse button is currently being held down, either by user input or suchibot.

Definition:

```ts
function isDown(button: MouseButton): boolean;
```

Example:

```js
const isRightClickHeld = Mouse.isDown(MouseButton.RIGHT);
console.log(isRightClickHeld); // true or false
```

#### Mouse.isUp

Returns whether the specified mouse button is currently NOT being held down. Mouse buttons can be released either by user input or by suchibot.

Definition:

```ts
function isUp(button: MouseButton): boolean;
```

Example:

```js
const isLeftClickReleased = Mouse.isUp(MouseButton.LEFT);
console.log(isLeftClickReleased); // true or false
```

### Keyboard

Functions that let you control the keyboard and/or register code to be run when a keyboard event occurs.

#### Keyboard.tap

Presses and then releases the specified key.

Definition:

```ts
tap(key: Key): void;
```

Example:

```js
// presses and then releases zero
Keyboard.tap(Key.ZERO);
```

#### Keyboard.hold

Presses down the specified key (and keeps holding it down until you release it, via `Keyboard.release`).

Definition:

```ts
hold(key: Key): void;
```

Example:

```js
// presses down zero
Keyboard.hold(Key.ZERO);
```

#### Keyboard.release

Releases (stops holding down) the specified key (which maybe is being held down because you used `Keyboard.hold`).

Definition:

```ts
release(key: Key): void;
```

Example:

```js
// stops holding down zero
Keyboard.release(Key.ZERO);
```

#### Keyboard.type

Types the specified string in, by tapping one key at a time, with a delay in-between each key.

Optionally, specify how fast to type by passing the delay in milliseconds between key as the second argument.

Definition:

```ts
function type(textToType: string, delayBetweenKeyPresses: number = 10): void;
```

Example:

```js
// type in a username and password:
Keyboard.type("my-username");
Keyboard.tap(Keys.TAB);
Keyboard.type("myP@ssw0rd!");

// type a message really slow:
Keyboard.type("hihihihihihihi", 200);
```

#### Keyboard.onDown

Registers a function to be called when a key on the keyboard starts being held down.

Each key on the keyboard can either be "down" or "up". When you hold a key down, it transitions from "up" to "down". When you stop holding a key down, it transitions from "down" to "up". When you tap a key, it transitions from "up" to "down", then a moment later, it transitions from "down" to "up".

`Keyboard.onDown` registers a function to be called whenever a key on the keyboard transitions from "up" to "down".

Returns a `Listener` object; call `.stop()` on the listener to unregister the function, so it's no longer called when the key is pressed down.

Definition:

```ts
function onDown(
  button: Key,
  eventHandler: (event: KeyboardEvent) => void
): Listener;
```

Example:

```js
// log whenever "B" is pressed down:
Keyboard.onDown(Key.B, () => {
  console.log("someone pressed B down!");
});

// log whenever any key is pressed down:
Keyboard.onDown(Key.ANY, (event) => {
  console.log("someone pressed down:", event.key);
});
```

#### Keyboard.onUp

Registers a function to be called when a key on the keyboard stops being held down.

Each key on the keyboard can either be "down" or "up". When you hold a key down, it transitions from "up" to "down". When you stop holding a key down, it transitions from "down" to "up". When you tap a key, it transitions from "up" to "down", then a moment later, it transitions from "down" to "up".

`Keyboard.onUp` registers a function to be called whenever a key on the keyboard transitions from "down" to "up".

Returns a `Listener` object; call `.stop()` on the listener to unregister the function, so it's no longer called when the key is released.

Definition:

<!-- prettier-ignore -->
```ts
function onUp(
  button: Key,
  eventHandler: (event: KeyboardEvent) => void
): Listener;
```

Example:

```js
// log whenever "B" is released:
Keyboard.onUp(Key.B, () => {
  console.log("someone released B!");
});

// log whenever any key is released:
Keyboard.onUp(Key.ANY, (event) => {
  console.log("someone released:", event.key);
});
```

#### Keyboard.isDown

Returns whether the specified key is currently being pressed, either by user input or suchibot.

Definition:

```ts
function isDown(key: Key): boolean;
```

Example:

```js
const isSpaceHeld = Keyboard.isDown(Key.SPACE);
console.log(isSpaceHeld); // true or false
```

#### Keyboard.isUp

Returns whether the specified key is currently NOT being pressed. Keys can be released either by user input or by suchibot.

Definition:

```ts
function isUp(key: Key): boolean;
```

Example:

```js
const isEscapeReleased = Keyboard.isDown(Key.ESCAPE);
console.log(isEscapeReleased); // true or false
```

### Screen

Functions that give you information about the screen.

#### Screen.getSize

Returns an object with `width` and `height` properties describing the screen resolution in pixels.

Definition:

```ts
function getSize(): { width: number; height: number };
```

Example:

```js
// get the screen resolution
const { width, height } = Screen.getSize();
console.log(width, height); // 1920, 1080
```

### Key

This object has strings on it with keyboard key names. These strings get passed into keyboard-related functions, like `Keyboard.tap`.

List of keys:

- `BACKSPACE`
- `DELETE`
- `ENTER`
- `TAB`
- `ESCAPE`
- `UP`
- `DOWN`
- `RIGHT`
- `LEFT`
- `HOME`
- `INSERT`
- `END`
- `PAGE_UP`
- `PAGE_DOWN`
- `SPACE`
- `F1`
- `F2`
- `F3`
- `F4`
- `F5`
- `F6`
- `F7`
- `F8`
- `F9`
- `F10`
- `F11`
- `F12`
- `F13`
- `F14`
- `F15`
- `F16`
- `F17`
- `F18`
- `F19`
- `F20`
- `F21`
- `F22`
- `F23`
- `F24`
- `LEFT_ALT`
- `LEFT_CONTROL`
- `LEFT_SHIFT`
- `RIGHT_ALT`
- `RIGHT_CONTROL`
- `RIGHT_SHIFT`
- `LEFT_SUPER`
- `LEFT_WINDOWS` (alias of LEFT_SUPER)
- `LEFT_COMMAND` (alias of LEFT_SUPER)
- `LEFT_META` (alias of LEFT_SUPER)
- `RIGHT_SUPER`
- `RIGHT_WINDOWS` (alias of RIGHT_SUPER)
- `RIGHT_COMMAND` (alias of RIGHT_SUPER)
- `RIGHT_META` (alias of RIGHT_SUPER)
- `PRINT_SCREEN`
- `VOLUME_DOWN`
- `VOLUME_UP`
- `MUTE`
- `PAUSE_BREAK`
- `NUMPAD_0`
- `NUMPAD_1`
- `NUMPAD_2`
- `NUMPAD_3`
- `NUMPAD_4`
- `NUMPAD_5`
- `NUMPAD_6`
- `NUMPAD_7`
- `NUMPAD_8`
- `NUMPAD_9`
- `NUMPAD_MULTIPLY`
- `NUMPAD_ADD`
- `NUMPAD_SUBTRACT`
- `NUMPAD_DECIMAL`
- `NUMPAD_DIVIDE`
- `NUMPAD_ENTER`
- `CAPS_LOCK`
- `NUM_LOCK`
- `SCROLL_LOCK`
- `SEMICOLON`
- `EQUAL`
- `COMMA`
- `MINUS`
- `PERIOD`
- `SLASH`
- `BACKTICK` (aka grave accent)
- `LEFT_BRACKET`
- `BACKSLASH`
- `RIGHT_BRACKET`
- `QUOTE`
- `A`
- `B`
- `C`
- `D`
- `E`
- `F`
- `G`
- `H`
- `I`
- `J`
- `K`
- `L`
- `M`
- `N`
- `O`
- `P`
- `Q`
- `R`
- `S`
- `T`
- `U`
- `V`
- `W`
- `X`
- `Y`
- `Z`
- `ZERO`
- `ONE`
- `TWO`
- `THREE`
- `FOUR`
- `FIVE`
- `SIX`
- `SEVEN`
- `EIGHT`
- `NINE`
- `ANY` (this one can't be pressed; it's only used when registering event listeners)

### MouseButton

This object has strings on it with the names of buttons on the mouse. These strings get passed into mouse-related functions, `Mouse.click`.

List of mouse buttons:

- `LEFT`
- `RIGHT`
- `MIDDLE`
- `ANY` (this one can't be pressed; it's only used when registering event listeners)

### MouseEvent

This object contains information about a mouse event that just occured. It gets passed into a function you pass in to `Mouse.onDown`, `Mouse.onUp`, `Mouse.onClick` or `Mouse.onMove`.

Each `MouseEvent` has these properties on it:

- `type`: A string indicating which kind of event this MouseEvent represents; could be either "click", "down", "up", or "move".
- `button`: A string from `MouseButton` indicating which button this event pertains to.
- `x`: A number indicating which horizontal location on the screen the event happened at. Small values represent the left side of the screen, and larger values represent the right side of the screen.
- `y`: A number indicating which vertical location on the screen the event happened at. Small values represent the top of the screen, and larger values represent the bottom of the screen.

### KeyboardEvent

This object contains information about a keyboard event that just occured. It gets passed into a function you pass in to `Keyboard.onDown` or `Keyboard.onUp`.

Each `KeyboardEvent` has these properties on it:

- `type`: A string indicating which kind of event this KeyboardEvent represents; could be either "down" or "up".
- `key`: A string from `Key` indicating which keyboard key this event pertains to.

### isKeyboardEvent

A function which returns whether its argument is a `KeyboardEvent` object.

### isMouseEvent

A function which returns whether its argument is a `MouseEvent` object.

### startListening

Call this function to start listening for input events, which makes functions starting with `on` work, like `Mouse.onClick`, `Keyboard.onUp`, etc.

You only need to call this when using sucibot as a package in a node script. When you run your script with the suchibot CLI, `startListening` will be called automatically before loading your script.

### stopListening

Call this function to stop listening for input events. This will make functions starting with `on` stop working, like `Mouse.onClick`, `Keyboard.onUp`, etc. If the node process isn't doing any other work (http server or something), this will also make the process exit.

Generally, you don't need to call this, as you can stop your script at any time by pressing Ctrl+C in the terminal window where it's running.

### sleep.async

This function returns a Promise that resolves in the specified number of milliseconds. You can use it to wait for an amount of time before running the next part of your code.

This function works best when used with the `await` keyword. The `await` keyword can only be used inside a function that has been marked as asynchronous using the `async` keyword.

#### Definition

```ts
function async(milliseconds: number): Promise<void>;
```

#### Example

```js
// Note that you have to write `async` here
Mouse.onClick(MouseButton.LEFT, async () => {
  Keyboard.tap(Keys.H);
  // Wait 100ms. Note that you have to write `await` here.
  await sleep.async(100);

  // After waiting 100ms, the code underneath the `await sleep.async` line will run.
  Keyboard.tap(Keys.I);
});

// If you need to use sleep.async in a non-async function, you can use the `then` method on the Promise it returns:

console.log("This prints now");
sleep.async(1000).then(() => {
  console.log("This prints 1 second later");
});
```

### sleep.sync

This function pauses execution (blocking the main thread) for the specified number of milliseconds.

Note that, if this function is used, no processing will occur until the specified amount of time has passed; notably, other mouse/keyboard events will not be processed. That means that those events will not be written to any `Tape`s that are recording. To avoid this issue, use `sleep.async` (instead of `sleep.sync`) inside of an `async` function.

> tl;dr use `sleep.async` instead unless you understand what you are doing

#### Definition

```ts
function sync(milliseconds: number): void;
```

#### Example

```js
// pauses everything for 100ms
sleep.sync(100);

// pause everything for 1 second
sleep.sync(1000);

// pause everything for 1 minute
sleep.sync(60000);
```

### Tape

`Tape`s can record all mouse/keyboard inputs so that they can be played back later. Call `tape.record()` to start keeping track of inputs. After some time has passed, call the `stopRecording` function to stop recording inputs. Then, to replay those inputs, call the `play` function on the `Tape`.

You can optionally pass an array of event filters into the `Tape` constructor; any events that match those filters will not be saved onto the recording. This is useful when you are using keyboard keys to start/stop/play recordings, and you don't want events for those keys to end up in the recording.

#### Definition

```ts
class Tape {
  static enum State {
    RECORDING,
    PLAYING,
    IDLE,
  };

  readonly state: State;

  constructor(
    eventsToIgnore?: Array<KeyboardEventFilter | MouseEventFilter>
  ): Tape;

  record(): void;
  stopRecording(): void;

  play(): Promise<void>; // Promise resolves when playback completes
  stopPlaying(): void; // Used to stop playback before completion

  serialize(): Object; // Converts the Tape into a JSON-compatible format

  static deserialize(serialized: Object): Tape; // Loads a tape from the serialized format
}
```

#### Example

```js
// Make a tape:
const tape = new Tape();

// Start the recording...
tape.record();

// We'll take a 4-second recording by waiting 4000ms before calling `stop`.
await sleep.async(4000);

// Move the mouse around, press keys, etc.

// Now, stop recording.
tape.stopRecording();

// Now, replay the tape, and the mouse and keyboard will do the same things you did during the 4000ms wait.
tape.play();
```

And, another example demonstrating using event filters to ignore certain events:

```js
import { keyboardEventFilter, Key, Tape } from "suchibot";

const eventsToIgnore = [
  keyboardEventFilter({
    key: Key.SCROLL_LOCK,
  }),
];

const tape = new Tape(eventsToIgnore);

// Now, when you record with this tape, any keyboard events with the same key as the one you passed to your filter will not be added to the recording (in this case, Scroll Lock).

// You can make event filters more specific by passing more information into them. To explain, consider the differences between the filters below:

// Matches all keyboard events:
const allKeyboardEvents = keyboardEventFilter();

// Matches all "down" keyboard events:
const allKeyDownEvents = keyboardEventFilter({ type: "down" });

// Matches all "up" keyboard events for the Pause/Break key:
const allPauseBreakUpEvents = keyboardEventFilter({
  type: "up",
  key: Key.PAUSE_BREAK,
});

// Mouse event filters work the same way, but for the properties on `MouseEvent`s:

import { mouseEventFilter, MouseButton } from "suchibot";

const allMouseEvents = mouseEventFilter();
const allMouseMoves = mouseEventFilter({ type: "move" });
const allRightClicks = mouseEventFilter({ button: MouseButton.RIGHT });
```

### Listener

This object is returned from `Mouse.onDown`, `Mouse.onUp`, `Mouse.onClick`, `Mouse.onMove`, `Keyboard.onDown`, and `Keyboard.onUp`. It has a `stop` function on it that will make the event listener/handler function you passed in stop being called when the corresponding input event happens. See the example below for more information.

#### Definition

```ts
type Listener = {
  stop: () => void;
};
```

#### Example

```js
// Save the listener when calling an on* function:
const listener = Mouse.onMove((event) => {
  console.log(`Mouse moved to: ${event.x}, ${event.y}`);
});

// Now, if you move the mouse around, you'll see the console log messages.
// To stop seeing them, you call `listener.stop`:
listener.stop();

// Now, you'll no longer see the console.log messages, because the function you
// passed in to Mouse.onMove isn't being called anymore.
```

### KeyboardEventFilter, MouseEventFilter, eventMatchesFilter, keyboardEventFilter, and mouseEventFilter

These types and functions are used to work with event filters, which can be passed into the `Tape` constructor to specify events to omit from the tape's recording.

`KeyboardEventFilter` and `MouseEventFilter` (with capitalized first letters) are the object types for filters. `keyboardEventFilter` and `mouseEventFilter` (with lowercase first letters) are builder functions for making filter objects corresponding to those types. `eventMatchesFilter` can be used to check if a `MouseEvent` or `KeyboardEvent` matches a filter.

The properties on a `MouseEventFilter` match those on a `MouseEvent`, and, likewise, the properties on a `KeyboardEventFilter` match those on a `KeyboardEvent`. As such, to identify what properties to create your filter with, you can use console.log to look at the `MouseEvent` or `KeyboardEvent` that you want to filter out (by performing the action and setting up a listener for it, with `Mouse.onDown`, `Keyboard.onUp`, etc).

#### Definition

```ts
type MouseEventFilter = {
  filterType: "Mouse";
  type?: "click" | "down" | "up" | "move";
  button?: MouseButton;
  x?: number;
  y?: number;
};

type KeyboardEventFilter = {
  filterType: "Keyboard";
  type?: "down" | "up";
  key?: Key;
};

function keyboardEventFilter(properties?: {
  type?: "down" | "up";
  key?: Key;
}): KeyboardEventFilter;

function mouseEventFilter(properties?: {
  type?: "click" | "down" | "up" | "move";
  button?: MouseButton;
  x?: number;
  y?: number;
}): MouseEventFilter;

function eventMatchesFilter(
  event: MouseEvent | KeyboardEvent,
  filter: MouseEventFilter | KeyboardEventFilter
): boolean;
```

#### Example

```js
import { keyboardEventFilter, Key, Tape } from "suchibot";

const eventsToIgnore = [
  keyboardEventFilter({
    key: Key.SCROLL_LOCK,
  }),
];

const tape = new Tape(eventsToIgnore);

// Now, when you record with this tape, any keyboard events with the same key as the one you passed to your filter will not be added to the recording (in this case, Scroll Lock).

// You can make event filters more specific by passing more information into them. To explain, consider the differences between the filters below:

// Matches all keyboard events:
const allKeyboardEvents = keyboardEventFilter();

// Matches all "down" keyboard events:
const allKeyDownEvents = keyboardEventFilter({ type: "down" });

// Matches all "up" keyboard events for the Pause/Break key:
const allPauseBreakUpEvents = keyboardEventFilter({
  type: "up",
  key: Key.PAUSE_BREAK,
});

// Mouse event filters work the same way, but for the properties on `MouseEvent`s:

import { mouseEventFilter, MouseButton } from "suchibot";

const allMouseEvents = mouseEventFilter();
const allMouseMoves = mouseEventFilter({ type: "move" });
const allRightClicks = mouseEventFilter({ button: MouseButton.RIGHT });
```

## License

MIT
