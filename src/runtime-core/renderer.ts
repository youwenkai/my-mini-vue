import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./component";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode: any, container: any) {
  //判断 element component
  if (isObject(vnode.type)) {
    // 处理组件
    processComponent(vnode, container);
  } else if (typeof vnode.type === "string") {
    processElement(vnode, container);
  }
}

function processComponent(vnode: any, container: any) {
  // 挂载组件
  mountComponent(vnode, container);
}

function mountComponent(vnode, container) {
  // 生成组件实例
  const instance = createComponentInstance(vnode);

  // 生成proxy代理对象
  instance.proxy = new Proxy(
    { _: instance },
    PublicInstanceProxyHandlers
    // FIXME: 抽离出去
    // {
    //   get(target, key) {
    //     const { setupState } = instance;
    //     if (key in setupState) {
    //       return setupState[key];
    //     }
    //     if (key === "$el") {
    //       return instance.vnode.el;
    //     }
    //   },
    // }
  );

  //安装组件
  setupComponent(instance);

  //render
  setupRenderEffect(instance, vnode, container);
}
export function setupRenderEffect(instance: any, vnode, container) {
  const { proxy } = instance;
  const subTree = instance.render.call(proxy);

  patch(subTree, container);

  // component组件vnode subTree是组件内元素的
  vnode.el = subTree.el;
}

export function processElement(vnode, container) {
  mountElement(vnode, container);
}

export function mountElement(vnode: any, container: any) {
  const { type, props, children } = vnode;
  const el = (vnode.el = document.createElement(type));
  if (props) {
    for (const prop in props) {
      el.setAttribute(prop, props[prop]);
    }
  }

  if (typeof children === "string") {
    el.textContent = children;
  } else if (Array.isArray(children)) {
    mountChildren(vnode, el);
  }

  container.append(el);
}
function mountChildren(vnode: any, container: any) {
  // throw new Error("Function not implemented.");
  const { children } = vnode;
  if (Array.isArray(children)) {
    children.forEach((child) => {
      patch(child, container);
    });
  }
}
