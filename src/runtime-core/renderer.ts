import { isObject } from "../shared/index";
import { createComponentInstance, setupComponent } from "./component";

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

  //安装组件
  setupComponent(instance);

  //render
  setupRenderEffect(instance, container);
}
export function setupRenderEffect(instance: any, container) {
  const subTree = instance.render();

  patch(subTree, container);
}

export function processElement(vnode, container) {
  mountElement(vnode, container);
}

export function mountElement(vnode: any, container: any) {
  const { type, props, children } = vnode;
  const el = document.createElement(type);
  vnode.el = el;
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
