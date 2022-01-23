export class Defer<T> {
  // @ts-ignore
  resolve: (value: T) => void;
  // @ts-ignore
  reject: (err: any) => void;
  promise: Promise<T>;

  constructor() {
    this.promise = new Promise<T>((res, rej) => {
      this.resolve = res;
      this.reject = rej;
    });
  }
}
