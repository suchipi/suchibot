export const sleepSync = (milliseconds: number) => {
  const target = Date.now() + milliseconds;
  while (Date.now() < target) {
    // haha, cpu go brrr
  }
};

export const sleep = (milliseconds: number) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));
