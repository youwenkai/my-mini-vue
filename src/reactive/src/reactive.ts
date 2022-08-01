import { track, trriger } from "./effect";

export function reactive(raw) {
  // reactive 通过proxy代理 get set 操作
  return new Proxy(raw, {
    get: function getter(target, key) {
      const res = Reflect.get(target, key);
      track(target, key);
      return res;
    },
    set: function setter(target, key, value) {
      const res = Reflect.set(target, key, value);
      trriger(target, key);
      return res;
    },
  });
}
