#!/usr/bin/env node
const suchibot = require("./dist/index");
module.exports = suchibot;

if (module === require.main) {
  // sets up esbuild-register, and forces require.resolve to always resolve suchibot to the current file
  const { patchCjs } = require("./dist/patch-cjs");
  patchCjs();

  const { main } = require("./dist/cli");
  Object.assign(globalThis, suchibot);
  main(suchibot);
}
