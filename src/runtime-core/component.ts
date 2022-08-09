import { shallowReadonly } from "../reactive/src/reactive";
import { emit } from "./componentEmits";
import { initProps } from "./componentProps";

interface IComponentInstance {
  vnode: any;
  type: any;
  setupState: any;
  proxy: any;
  emit: any;
}

export function createComponentInstance(vnode): IComponentInstance {
  const instance = {
    vnode,
    type: vnode.type,
    setupState: {},
    proxy: null,
    emit: () => {},
  };

  instance.emit = emit.bind(null, instance) as any;
  return instance;
}

export function setupComponent(instance) {
  const { props } = instance.vnode;
  // TODO
  initProps(instance, props);
  // initSlots();

  // 处理setup
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;

  const { setup } = Component;

  if (setup) {
    // setup 可以返回function / object
    // props是shallowReadonly
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });
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
