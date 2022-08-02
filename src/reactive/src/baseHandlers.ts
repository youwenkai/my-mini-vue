import { track, trriger } from "./effect";

// 抽离出公共的get set 操作
function createGetter(isReadonly = false) {
  return function getter(target, key) {
    const res = Reflect.get(target, key);
    if (!isReadonly) {
      track(target, key);
    }
    return res;
  };
}
function createSetter() {
  return function setter(target, key, value) {
    const res = Reflect.set(target, key, value);
    trriger(target, key);
    return res;
  };
}

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);

export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  get: readonlyGet,
  set: function setter(target, key, value) {
    console.warn("readonly not to be set");
    return true;
  },
};
