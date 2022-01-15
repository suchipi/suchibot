const path = require("path");
const kame = require("kame");

const runtime = new kame.Runtime();

module.exports = runtime.load(path.join(__dirname, "src", "index.ts"));

if (module === require.main) {
  runtime.load(path.join(__dirname, "src", "cli.ts"));
}
