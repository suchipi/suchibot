import fs from "fs";
import path from "path";
import kleur from "kleur";
import util from "util";

// @ts-ignore
import pkgJson from "../package.json";

function printUsage() {
  console.log(`suchibot ${pkgJson.version}`);
  console.log("");
  console.log("Usage:");
  console.log("  suchibot [path to script file]");
  console.log("");
  console.log(
    "If no script file path is specified, the program will attempt to load script.ts or script.js (whichever exists)."
  );
  console.log("");
  console.log("Examples:");
  console.log("  suchibot ./my-script.js");
}

function formatError(err: unknown) {
  let prettyErr = String(err);

  if (
    typeof err === "object" &&
    err != null &&
    // @ts-ignore
    typeof err.message === "string" &&
    // @ts-ignore
    typeof err.stack === "string"
  ) {
    const error = err as Error;

    prettyErr =
      kleur.red(error.message) +
      "\n" +
      (error.stack || "")
        .split("\n")
        .map((line) => line.trim())
        .map((line, index) => {
          if (index === 0) return null;

          return "  " + kleur.gray(line);
        })
        .filter(Boolean)
        .join("\n");
  }

  if (typeof err === "object" && err != null) {
    const propNames = Object.getOwnPropertyNames(err).filter(
      (name) => name !== "stack" && name !== "message"
    );
    if (propNames.length > 0) {
      const props = {};
      for (const name of propNames) {
        props[name] = err[name];
      }

      prettyErr += kleur.magenta(
        "\nThe above error also had these properties on it: " +
          util.inspect(props, { depth: Infinity, colors: true })
      );
    }
  }

  return prettyErr;
}

function main(suchibot: typeof import("./index")) {
  if (process.argv.includes("-h") || process.argv.includes("--help")) {
    printUsage();
    process.exit(0);
  }

  if (process.argv.includes("-v") || process.argv.includes("--version")) {
    console.log(`${pkgJson.version}`);
    process.exit(0);
  }

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
      console.log("");
      printUsage();
      process.exit(1);
    }
  }

  if (!path.isAbsolute(modulePath)) {
    modulePath = path.resolve(process.cwd(), modulePath);
  }

  if (!fs.existsSync(modulePath)) {
    console.error("Trying to load non-existent file:", modulePath);
    console.log("");
    printUsage();
    process.exit(1);
  }

  suchibot.startListening();
  console.log(
    "Now listening for mouse/keyboard events. Press Ctrl+C to exit at any time."
  );

  process.on("unhandledRejection", (error: any) => {
    console.error(kleur.red("An unhandled Promise rejection occurred:"));
    console.error(formatError(error));
  });

  try {
    require(modulePath);
  } catch (err: any) {
    console.error(kleur.red("An error occurred in your script:"));
    console.error(formatError(err));

    suchibot.stopListening();
    process.exit(1);
  }
}

export { main };
