import * as kame from "kame";

const ourKame = kame.configure({
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
