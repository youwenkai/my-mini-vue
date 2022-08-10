import { shallowReadonly } from "../reactive/src/reactive";
import { emit } from "./componentEmits";
import { initProps } from "./componentProps";
import { initSlots } from "./componentSlots";

interface IComponentInstance {
  vnode: any;
  type: any;
  setupState: any;
  proxy: any;
  slots: any;
  provides: any;
  emit: any;
}

export function createComponentInstance(vnode, parent): IComponentInstance {
  console.log("createComponentInstance parent", parent);
  const instance = {
    vnode,
    type: vnode.type,
    setupState: {},
    proxy: null,
    slots: {},
    parent,
    // 为了跨级获取 provide需要继承父级的provide
    provides: parent ? parent.provides : {},
    emit: () => {},
  };

  instance.emit = emit.bind(null, instance) as any;
  return instance;
}

export function setupComponent(instance) {
  const { props, children } = instance.vnode;
  // TODO
  initProps(instance, props);
  initSlots(instance, children);

  // 处理setup
  setupStatefulComponent(instance);
}

function setupStatefulComponent(instance: any) {
  const Component = instance.type;

  const { setup } = Component;

  if (setup) {
    // 标注当前正在执行的组件实例 在处理setup之前赋值
    // 确保在setup内能使用
    setCurrentInstance(instance);
    // setup 可以返回function / object
    // props是shallowReadonly
    const setupResult = setup(shallowReadonly(instance.props), {
      emit: instance.emit,
    });

    //处理完setup之后 销毁
    setCurrentInstance(null);

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

// 当前激活的组件实例
let currentInstance = null;

export function getCurrentInstance() {
  return currentInstance;
}

export function setCurrentInstance(instance) {
  currentInstance = instance;
}
