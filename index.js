#!/usr/bin/env node
const suchibot = require("./dist/index");
module.exports = suchibot;

if (module === require.main) {
  const { setCache } = require("./dist/load-file");
  setCache(__filename, module);

  const { main } = require("./dist/cli");
  Object.assign(globalThis, suchibot);
  main(suchibot);
}
