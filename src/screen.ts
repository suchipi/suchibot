import * as libnut from "@nut-tree/libnut";

export const Screen = {
  getSize(): { width: number; height: number } {
    return libnut.getScreenSize();
  },
};
