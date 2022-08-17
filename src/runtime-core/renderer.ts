import { effect } from "../reactive/src";
import { ShapeFlag } from "../shared/shapeFlags";
import { createAppAPI } from "./apiCreateApp";
import { createComponentInstance, setupComponent } from "./component";
import { PublicInstanceProxyHandlers } from "./componentPublicInstance";

export const Fragment = Symbol("Fragment");
export const Text = Symbol("Text");

export function createRenderer(options) {
  const {
    createElement: hostCreateElement,
    patchProp: hostPatchProp,
    insert: hostInsert,
  } = options;
  function render(n1, n2, container, parentComponent) {
    patch(n1, n2, container, parentComponent);
  }

  function patch(n1, n2, container: any, parentComponent) {
    const { shapeFlag, type } = n2;

    // 新增Fragment -> 只渲染children
    switch (type) {
      case Fragment:
        processFragment(n2, container, parentComponent);
        break;
      case Text:
        processText(n2, container);
        break;
      default:
        //判断 element component
        if (shapeFlag & ShapeFlag.SETUPFUL_COMPONENT) {
          // 处理组件
          processComponent(n1, n2, container, parentComponent);
        } else if (shapeFlag & ShapeFlag.ELEMENT) {
          processElement(n1, n2, container, parentComponent);
        }
    }
  }

  function processComponent(n1, n2, container: any, parentComponent) {
    if (!n1) {
      // 挂载组件
      mountComponent(n2, container, parentComponent);
    } else {
      console.log("更新组件");
    }
  }

  function mountComponent(vnode, container, parentComponent) {
    // 生成组件实例
    const instance: any = createComponentInstance(vnode, parentComponent);

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
    effect(() => {
      const { proxy, isMounted } = instance;

      if (!isMounted) {
        console.log("初始化");
        const subTree = (instance.subTree = instance.render.call(proxy));
        patch(null, subTree, container, instance);
        // component组件vnode subTree是组件内元素的
        vnode.el = subTree.el;
        instance.isMounted = true;
      } else {
        console.log("更新");
        const subTree = instance.render.call(proxy);
        const prevSubtree = instance.subTree;
        instance.subTree = subTree;
        patch(prevSubtree, subTree, container, instance);
        vnode.el = subTree.el;
      }
    });
  }

  function processElement(n1, n2, container, parentComponent) {
    if (n1) {
      patchElement(n1, n2, container);
    } else {
      mountElement(n2, container, parentComponent);
    }
  }

  function mountElement(vnode: any, container: any, parentComponent) {
    const { type, props, children, shapeFlag } = vnode;
    const el = (vnode.el = hostCreateElement(type));
    if (props) {
      for (const prop in props) {
        hostPatchProp(el, prop, props[prop]);
      }
    }

    if (shapeFlag & ShapeFlag.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlag.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent);
    }
    // container.append(el);
    hostInsert(el, container);
  }
  function patchElement(n1, n2, container) {
    console.log("====patchElement");
    console.log("prev vnode:", n1);
    console.log("cur vnode:", n2);
  }
  function mountChildren(vnode: any, container: any, parentComponent) {
    // throw new Error("Function not implemented.");
    const { children } = vnode;
    if (Array.isArray(children)) {
      children.forEach((child) => {
        patch(child.el, child, container, parentComponent);
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
