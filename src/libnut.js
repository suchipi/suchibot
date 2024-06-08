switch (process.platform) {
  case "win32": {
    module.exports = require("@suchipi/libnut-win32");
    break;
  }
  case "linux": {
    module.exports = require("@suchipi/libnut-linux");
    break;
  }
  case "darwin": {
    module.exports = require("@suchipi/libnut-darwin");
    break;
  }
  default: {
    throw new Error("Unsupported platform: " + process.platform);
  }
}
