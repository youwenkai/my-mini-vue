import {
  mutableHandlers,
  ReactiveFlags,
  readonlyHandlers,
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

export function isReactive(value: any) {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly(value: any) {
  return !!value[ReactiveFlags.IS_READONLY];
}
