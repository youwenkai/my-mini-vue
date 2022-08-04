export function createComponentInstance(vnode) {
  return { vnode, type: vnode.type };
}

export function setupComponent(instance) {
  // TODO
  // initProps();
  // initSlots();

  // 处理setup
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;

  const { setup } = Component;

  if (setup) {
    // setup 可以返回function / object
    const setupResult = setup();
    // 所以需要进一步处理
    handlerSetupResult(instance, setupResult);
  }
}
export function handlerSetupResult(instance: any, setupResult: any) {
  if (typeof setupResult === "object") {
    instance.setupState = setupResult;
  }
  finishComponentSetup(instance);
}
export function finishComponentSetup(instance: any) {
  // 开始render
  const Component = instance.type;
  if (Component.render) {
    instance.render = Component.render;
  }
}
