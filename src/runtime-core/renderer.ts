import { ShapeFlag } from "../shared/shapeFlags";
import { createAppAPI } from "./apiCreateApp";
import { createComponentInstance, setupComponent } from "./component";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";

export const Fragment = Symbol("Fragment");
export const Text = Symbol("Text");

export function createRenderer(options) {
  const { createElement, patchProp, insert } = options;
  function render(vnode, container, parentComponent) {
    patch(vnode, container, parentComponent);
  }

  function patch(vnode: any, container: any, parentComponent) {
    const { shapeFlag, type } = vnode;

    // 新增Fragment -> 只渲染children
    switch (type) {
      case Fragment:
        processFragment(vnode, container, parentComponent);
        break;
      case Text:
        processText(vnode, container);
        break;
      default:
        //判断 element component
        if (shapeFlag & ShapeFlag.SETUPFUL_COMPONENT) {
          // 处理组件
          processComponent(vnode, container, parentComponent);
        } else if (shapeFlag & ShapeFlag.ELEMENT) {
          processElement(vnode, container, parentComponent);
        }
    }
  }

  function processComponent(vnode: any, container: any, parentComponent) {
    // 挂载组件
    mountComponent(vnode, container, parentComponent);
  }

  function mountComponent(vnode, container, parentComponent) {
    // 生成组件实例
    const instance = createComponentInstance(vnode, parentComponent);

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
  function setupRenderEffect(instance: any, vnode, container) {
    const { proxy } = instance;
    const subTree = instance.render.call(proxy);

    patch(subTree, container, instance);

    // component组件vnode subTree是组件内元素的
    vnode.el = subTree.el;
  }

  function processElement(vnode, container, parentComponent) {
    mountElement(vnode, container, parentComponent);
  }

  function mountElement(vnode: any, container: any, parentComponent) {
    const { type, props, children, shapeFlag } = vnode;
    const el = (vnode.el = createElement(type));
    if (props) {
      for (const prop in props) {
        patchProp(el, prop, props[prop]);
      }
    }

    if (shapeFlag & ShapeFlag.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlag.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent);
    }
    // container.append(el);
    insert(el, container);
  }
  function mountChildren(vnode: any, container: any, parentComponent) {
    // throw new Error("Function not implemented.");
    const { children } = vnode;
    if (Array.isArray(children)) {
      children.forEach((child) => {
        patch(child, container, parentComponent);
      });
    }
  }
  function processFragment(vnode: any, container: any, parentComponent) {
    // 只渲染子元素
    mountChildren(vnode, container, parentComponent);
  }
  function processText(vnode: any, container: any) {
    const { children } = vnode;
    const textVNode = (vnode.el = document.createTextNode(children));
    container.append(textVNode);
  }

  return {
    createApp: createAppAPI(render),
  };
}
