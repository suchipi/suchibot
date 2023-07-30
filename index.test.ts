import { test, expect } from "vitest";
import * as fs from "node:fs";
import * as path from "node:path";

// intentionally a require instead of an import so that vitest doesn't do ESM
// interop transformations on it (which adds otherwise-nonexistent 'default'
// export)
const suchibot = require(".");

test("module exports", () => {
  const exportNames = Object.keys(suchibot).filter((key) => suchibot[key]);

  expect(exportNames).toMatchInlineSnapshot(`
    [
      "Mouse",
      "Keyboard",
      "MouseButton",
      "Key",
      "MouseEvent",
      "KeyboardEvent",
      "isKeyboardEvent",
      "isMouseEvent",
      "sleep",
      "sleepSync",
      "Screen",
      "startListening",
      "stopListening",
      "eventMatchesFilter",
      "keyboardEventFilter",
      "mouseEventFilter",
      "Tape",
    ]
  `);
});

const readmeText = fs.readFileSync(path.join(__dirname, "README.md"), "utf-8");

test("readme specifies the correct number of exports", () => {
  const exportNames = Object.keys(suchibot).filter((key) => suchibot[key]);

  const phraseRegExp = /The "suchibot" module has (\d+) named exports/;
  const phraseMatches = readmeText.match(phraseRegExp);
  if (phraseMatches == null) {
    throw new Error(
      `Expected readme content to match RegExp ${phraseRegExp}, but it did not`
    );
  }

  const numExports = exportNames.length;
  const numExportsInReadme = phraseMatches[1];

  expect(numExports).toEqual(parseInt(numExportsInReadme));
});

test("readme mentions all the public methods of all the classes", () => {
  const classes = ["Mouse", "Keyboard", "Screen"];
  for (const className of classes) {
    const klass = suchibot[className];

    const staticMethodNames: Array<string> = [];
    for (const name in klass) {
      const value = klass[name];

      if (value === Object.prototype[name]) continue;

      if (typeof value === "function" && !name.startsWith("_")) {
        staticMethodNames.push(name);
      }
    }

    const instanceMethodNames: Array<string> = [];
    for (const name in klass.prototype) {
      const value = klass.prototype[name];

      if (value === Object.prototype[name]) continue;

      if (typeof value === "function" && !name.startsWith("_")) {
        instanceMethodNames.push(name);
      }
    }

    for (const name of [...staticMethodNames, ...instanceMethodNames]) {
      expect(readmeText).toMatch(new RegExp(`${className}.*${name}`, "m"));
    }
  }
});

test("readme mentions all the module exports", () => {
  const exportNames = Object.keys(suchibot)
    .filter((key) => suchibot[key])
    .filter((name) => {
      if (name === "sleepSync") {
        // ignore, because it's deprecated in favor of sleep.sync
        return false;
      } else {
        return true;
      }
    });

  for (const name of exportNames) {
    expect(readmeText).toContain(name);
  }
});
