import * as libnut from "./libnut";
import makeDebug from "debug";

const debug = makeDebug("suchibot:screen");

export const Screen = {
  getSize(): { width: number; height: number } {
    debug("Screen.getSize called");
    const result = libnut.getScreenSize();
    debug("Screen.getSize result: %o", result);
    return result;
  },
};
