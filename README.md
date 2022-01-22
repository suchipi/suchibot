# suchibot

A cross-platform AutoHotKey-like thing with JavaScript/TypeScript as its scripting language. Built on top of [`uiohook-napi`](https://npm.im/uiohook-napi) and [`nut.js`](https://github.com/nut-tree/nut.js).

## Installation

First, you'll need [node.js](https://nodejs.org/en/download/) installed. Suchibot should work with most versions of Node, but for best compatibility, you can install [version 14](https://nodejs.org/dist/latest-fermium/), which is what it was tested against.

On Windows, you'll also need to install the [Microsoft Visual C++ Redistributable](https://support.microsoft.com/en-us/help/2977003/the-latest-supported-visual-c-downloads).

If you're running Windows 10 N, you'll also need to install the [Media Feature Pack](https://support.microsoft.com/en-us/topic/media-feature-pack-for-windows-10-n-may-2020-ebbdf559-b84c-0fc2-bd51-e23c9f6a4439).

On Linux, you also need libXtst. You can get that on Ubuntu-based distros by running this in a terminal:

> NOTE: I haven't tested suchibot in wayland, only Xorg. It probably doesn't work in wayland.

```
sudo apt install build-essential libxtst-dev
```

On macOS, you also need XCode command-line tools. You can get that by running this in a terminal:

```
xcode-select --install
```

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
  await sleep(100);
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
  sleepSync,
  record,
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

// `sleep` returns a Promise that resolves in the specified number of milliseconds. eg:
await sleep(100);

// `sleepSync` blocks the main thread for the specified number of milliseconds. eg:
sleepSync(100);

// `record` records all the mouse/keyboard events that happen until you
// call `recording.stop()`, and then you can replay the recording to simulate
// the same mouse/keyboard events.

// Starts the recording...
const recording = record();

// We'll take a 4-second recording by waiting 4000ms before calling `stop`.
await sleep(4000);

// Move the mouse around, press keys, etc.

// Now, stop the recording.
recording.stop();

// Now, replay the recording, and the mouse and keyboard will do the same things you did during the 4000ms wait.
recording.replay();
```

See the [examples folder](https://github.com/suchipi/suchibot/tree/main/examples) for some example scripts.

## Full API Documentation

The "suchibot" module has 11 named exports. Each is documented here.

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

### startListening

Call this function to start listening for input events, which makes functions starting with `on` work, like `Mouse.onClick`, `Keyboard.onUp`, etc.

You only need to call this when using sucibot as a package in a node script. When you run your script with the suchibot CLI, `startListening` will be called automatically before loading your script.

### stopListening

Call this function to stop listening for input events. This will make functions starting with `on` stop working, like `Mouse.onClick`, `Keyboard.onUp`, etc. If the node process isn't doing any other work (http server or something), this will also make the process exit.

Generally, you don't need to call this, as you can stop your script at any time by pressing Ctrl+C in the terminal window where it's running.

### sleep

This function returns a Promise that resolves in the specified number of milliseconds. You can use it to wait for an amount of time before running the next part of your code.

This function works best when used with the `await` keyword. The `await` keyword can only be used inside a function that has been marked as asynchronous using the `async` keyword.

#### Definition

```ts
function sleep(milliseconds: number): Promise<void>;
```

#### Example

```js
// Note that you have to write `async` here
Mouse.onClick(MouseButton.LEFT, async () => {
  Keyboard.tap(Keys.H);
  // Wait 100ms. Note that you have to write `await` here.
  await sleep(100);

  // After waiting 100ms, the code underneath the `await sleep` line will run.
  Keyboard.tap(Keys.I);
});

// If you need to use sleep in a non-async function, you can use the `then` method on the Promise it returns:

console.log("This prints now");
sleep(1000).then(() => {
  console.log("This prints 1 second later");
});
```

### sleepSync

This function pauses execution (blocking the main thread) for the specified number of milliseconds.

Note that, if this function is used, no processing will occur until the specified amount of time has passed; notably, other mouse/keyboard events will not be processed. To avoid this issue, use `sleep` (not `sleepSync`) inside of an `async` function.

#### Definition

```ts
function sleepSync(milliseconds: number): void;
```

#### Example

```js
// pauses everything for 100ms
sleepSync(100);

// pause everything for 1 second
sleepSync(1000);

// pause everything for 1 minute
sleepSync(60000);
```

### record

This function records all mouse/keyboard inputs so that they can be played back later. Inputs will start being recorded as soon as `record` is called. After some time has passed, call the `stop` function on the `Recording` that gets returned from `record` in order to stop recording input. Then, to replay those inputs, call the `replay` function on the `Recording`.

#### Definition

```ts
function record(): Recording;

// Where `Recording` is:
type Recording = {
  stop: () => void;
  replay: () => void;
};
```

#### Example

```js
// Start recording...
const recording = record();

// We'll take a 4-second recording by waiting 4000ms before calling `stop`.
await sleep(4000);

recording.stop();

// Now, replay the recording, and the mouse and keyboard will do the same things you did during the 4000ms wait.
recording.replay();
```

### Recording

This object is returned from the `record` function, and has functions on it that let you stop and re-play the recording. You can use it to capture mouse/keyboard input, and then re-play it (make the same mouse/keyboard actions occur on the computer again).

#### Definition

```ts
type Recording = {
  stop: () => void;
  replay: () => void;
};
```

#### Example

```js
// Start recording...
const recording = record();

// We'll take a 4-second recording by waiting 4000ms before calling `stop`.
await sleep(4000);

recording.stop();

// Now, replay the recording, and the mouse and keyboard will do the same things you did during the 4000ms wait.
recording.replay();
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

## License

MIT
