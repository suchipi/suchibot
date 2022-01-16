#!/usr/bin/env node
const path = require("path");
const kame = require("kame");

const runtime = new kame.Runtime();

const suchibot = runtime.load(path.join(__dirname, "src", "index.ts"));
module.exports = suchibot;

if (module === require.main) {
  runtime.cache[__filename] = module;
  const { main } = runtime.load(path.join(__dirname, "src", "cli.ts"));
  main(suchibot);
}
