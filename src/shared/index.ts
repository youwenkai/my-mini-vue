export const extend = Object.assign;

export function isObject(obj) {
  return obj !== null && typeof obj === "object";
}

export function hasChanged(value, newValue) {
  return !Object.is(value, newValue);
}

export const hasOwn = (target, key) =>
  Object.prototype.hasOwnProperty.call(target, key);
