import * as libnut from "./libnut";

export const Screen = {
  getSize(): { width: number; height: number } {
    return libnut.getScreenSize();
  },
};
