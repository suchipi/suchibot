import * as kame from "kame";

const ourKame = kame.configure({
  resolver: (id: string, fromFilePath: string) => {
    if (id === "suchibot") {
      return require.resolve("..");
    } else {
      return kame.defaultResolver.resolve(id, fromFilePath);
    }
  },
  loader: (filename: string) => {
    return kame.defaultLoader.load(filename, { targets: { node: "current" } });
  },
});

const runtime = new ourKame.Runtime();

export function loadFile(filename: string) {
  runtime.load(filename);
}

export function setCache(filename: string, moduleObject: any) {
  runtime.cache[filename] = moduleObject;
}
