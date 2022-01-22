import kleur from "kleur";
import util from "util";

export function formatError(err: unknown): string {
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
