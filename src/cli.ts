import fs from "fs";
import path from "path";
import kleur from "kleur";

let modulePath = process.argv[2];

const defaultTsPath = path.resolve(process.cwd(), "./script.ts");
const defaultJsPath = path.resolve(process.cwd(), "./script.js");

if (modulePath == null) {
  if (fs.existsSync(defaultTsPath)) {
    modulePath = defaultTsPath;
  } else if (fs.existsSync(defaultJsPath)) {
    modulePath = defaultJsPath;
  } else {
    console.error(
      kleur.red(
        `Not sure which file to run. Please either specify a script as the first argument to suchibot, or create a file named ${kleur.yellow(
          "script.ts"
        )} or ${kleur.yellow("script.js")} in the current folder.`
      )
    );
    process.exit(1);
  }
}

if (!path.isAbsolute(modulePath)) {
  modulePath = path.resolve(process.cwd(), modulePath);
}

if (!fs.existsSync(modulePath)) {
  console.error("Trying to load non-existent file:", modulePath);
  process.exit(1);
}

try {
  require(modulePath);
} catch (err) {
  console.error("An error occurred in your script:");
  console.error(err);
  process.exit(1);
}
