import { mutableHandlers, readonlyHandlers } from "./baseHandlers";

// 抽离公共的创建proxy操作
function createReactiveObj(target, baseHandler) {
  return new Proxy(target, baseHandler);
}

export function reactive(raw) {
  // reactive 通过proxy代理 get set 操作
  //   return new Proxy(raw, mutableHandlers);
  return createReactiveObj(raw, mutableHandlers);
}
// 不需要收集依赖
export function readonly(raw) {
  // reactive 通过proxy代理 get set 操作
  //   return new Proxy(raw, readonlyHandlers);
  return createReactiveObj(raw, readonlyHandlers);
}
