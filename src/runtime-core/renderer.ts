import { ShapeFlag } from "../shared/shapeFlags";
import { createComponentInstance, setupComponent } from "./component";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";

export const Fragment = Symbol("Fragment");

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode: any, container: any) {
  const { shapeFlag, type } = vnode;

  // 新增Fragment -> 只渲染children
  switch (type) {
    case Fragment:
      processFragment(vnode, container);
      break;
    default:
      //判断 element component
      if (shapeFlag & ShapeFlag.SETUPFUL_COMPONENT) {
        // 处理组件
        processComponent(vnode, container);
      } else if (shapeFlag & ShapeFlag.ELEMENT) {
        processElement(vnode, container);
      }
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
  const { type, props, children, shapeFlag } = vnode;
  const el = (vnode.el = document.createElement(type));
  if (props) {
    for (const prop in props) {
      const isOn = /^on[A-Z]/.test(prop);
      if (isOn) {
        const eventName = prop.slice(2).toLowerCase();
        el.addEventListener(eventName, props[prop]);
      } else {
        el.setAttribute(prop, props[prop]);
      }
    }
  }

  if (shapeFlag & ShapeFlag.TEXT_CHILDREN) {
    el.textContent = children;
  } else if (shapeFlag & ShapeFlag.ARRAY_CHILDREN) {
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
function processFragment(vnode: any, container: any) {
  // 只渲染子元素
  mountChildren(vnode, container);
}
