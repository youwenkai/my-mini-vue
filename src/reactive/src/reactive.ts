import {
  mutableHandlers,
  ReactiveFlags,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from "./baseHandlers";

// 抽离公共的创建proxy操作
function createReactiveObj(target: any, baseHandler: any) {
  return new Proxy(target, baseHandler);
}

export function reactive(raw: any) {
  // reactive 通过proxy代理 get set 操作
  //   return new Proxy(raw, mutableHandlers);
  return createReactiveObj(raw, mutableHandlers);
}
// 不需要收集依赖
export function readonly(raw: any) {
  // reactive 通过proxy代理 get set 操作
  //   return new Proxy(raw, readonlyHandlers);
  return createReactiveObj(raw, readonlyHandlers);
}

// 浅层 不会嵌套进去
export function shallowReadonly(raw: any) {
  return createReactiveObj(raw, shallowReadonlyHandlers);
}

export function isReactive(value: any) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value: any) {
  return !!value[ReactiveFlags.IS_READONLY];
}

// 检查对象是否是由 reactive 或 readonly 创建的 proxy
export function isProxy(value: any) {
  return isReactive(value) || isReadonly(value);
}
