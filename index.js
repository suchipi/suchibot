const path = require("path");
const kame = require("kame");

const runtime = new kame.Runtime();

const suchibot = runtime.load(path.join(__dirname, "src", "index.ts"));
module.exports = suchibot;

if (module === require.main) {
  runtime.cache[__filename] = module;
  suchibot.startListening();
  runtime.load(path.join(__dirname, "src", "cli.ts"));
}
