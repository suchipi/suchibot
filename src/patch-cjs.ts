import path from "path";
import { Module } from "module";
import { register } from "esbuild-register/dist/node";

export function patchCjs() {
  const originalResolveFilename = (Module as any)._resolveFilename;
  (Module as any)._resolveFilename = function patchedResolveFilename(
    request: string,
    parent: any,
    isMain: boolean,
    options: any
  ) {
    if (request === "suchibot") {
      return path.resolve(__dirname, "..", "index.js");
    } else {
      return originalResolveFilename(request, parent, isMain, options);
    }
  };

  register({
    target: `node${process.version.replace(/^v/i, "")}`,
  });
}
