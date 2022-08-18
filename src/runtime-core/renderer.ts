import { effect } from "../reactive/src";
import { EMPTY_OBJ } from "../shared";
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
    remove: hostRemove,
    setElementText: hostSetElementText,
  } = options;
  function render(n1, n2, container, parentComponent) {
    patch(n1, n2, container, parentComponent, null);
  }

  function patch(n1, n2, container: any, parentComponent, anchor) {
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
          processComponent(n1, n2, container, parentComponent, anchor);
        } else if (shapeFlag & ShapeFlag.ELEMENT) {
          processElement(n1, n2, container, parentComponent, anchor);
        }
    }
  }

  function processComponent(n1, n2, container: any, parentComponent, anchor) {
    if (!n1) {
      // 挂载组件
      mountComponent(n2, container, parentComponent, anchor);
    } else {
      console.log("更新组件");
    }
  }

  function mountComponent(vnode, container, parentComponent, anchor) {
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
    setupRenderEffect(instance, vnode, container, anchor);
  }
  function setupRenderEffect(instance: any, vnode, container, anchor) {
    effect(() => {
      const { proxy, isMounted } = instance;

      if (!isMounted) {
        console.log("初始化");
        const subTree = (instance.subTree = instance.render.call(proxy));
        patch(null, subTree, container, instance, anchor);
        // component组件vnode subTree是组件内元素的
        vnode.el = subTree.el;
        instance.isMounted = true;
      } else {
        console.log("更新");
        const subTree = instance.render.call(proxy);
        const prevSubtree = instance.subTree;
        instance.subTree = subTree;
        patch(prevSubtree, subTree, container, instance, anchor);
        vnode.el = subTree.el;
      }
    });
  }

  function processElement(n1, n2, container, parentComponent, anchor) {
    if (n1) {
      patchElement(n1, n2, container, parentComponent, anchor);
    } else {
      mountElement(n2, container, parentComponent, anchor);
    }
  }

  function mountElement(vnode: any, container: any, parentComponent, anchor) {
    const { type, props, children, shapeFlag } = vnode;
    const el = (vnode.el = hostCreateElement(type));
    if (props) {
      for (const prop in props) {
        hostPatchProp(el, prop, null, props[prop]);
      }
    }

    if (shapeFlag & ShapeFlag.TEXT_CHILDREN) {
      el.textContent = children;
    } else if (shapeFlag & ShapeFlag.ARRAY_CHILDREN) {
      mountChildren(vnode, el, parentComponent, anchor);
    }
    // container.append(el);
    hostInsert(el, container, anchor);
  }
  function patchElement(n1, n2, container, parentComponent, anchor) {
    console.log("====patchElement");
    console.log("prev vnode:", n1);
    console.log("cur vnode:", n2);

    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    const el = (n2.el = n1.el);

    patchChildren(n1, n2, el, parentComponent, anchor);
    patchProps(el, oldProps, newProps);
  }

  function patchChildren(n1, n2, container, parentComponent, anchor) {
    // 子节点只有两种结构 text or array
    const { shapeFlag: prevShapeFlag, children: c1 } = n1;
    const { shapeFlag, children: c2 } = n2;

    if (shapeFlag & ShapeFlag.TEXT_CHILDREN) {
      // 重构

      // 如果新的子节点是text
      if (prevShapeFlag & ShapeFlag.ARRAY_CHILDREN) {
        // 而旧的子节点是数组

        // 把旧节点的children清空
        unmountedChildren(c1);
      }
      // 1. 当旧节点是数组节点时，先清空children 在设置text
      // 2. 当旧节点时文本节点时，直接设置text
      if (c1 !== c2) {
        hostSetElementText(container, c2);
      }
    } else {
      // 新节点时children
      if (prevShapeFlag & ShapeFlag.TEXT_CHILDREN) {
        // 旧节点是文本
        hostSetElementText(container, "");
        mountChildren(c2, container, parentComponent, anchor);
      } else {
        // 旧节点是数组

        console.log("新旧节点都是数组，开始diff算法");
        patchKeyedChildren(c1, c2, container, parentComponent, anchor);
      }
    }
  }
  function patchKeyedChildren(c1, c2, container, parentComponent, anchor) {
    let i = 0;
    let e1 = c1.length - 1;
    let e2 = c2.length - 1;

    function isSameVNodeType(n1, n2) {
      return n1.type === n2.type && n1.key === n2.key;
    }
    // 左侧
    console.log("左侧");
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i];
      console.group("================", i);
      console.log(n1, n2);
      // 如果节点是否相等
      if (isSameVNodeType(n1, n2)) {
        // console.log(n1, n2, "not same");
        patch(n1, n2, container, parentComponent, anchor);
      } else {
        break;
      }
      console.groupEnd();
      i++;
    }

    // 右侧
    console.log("右侧");
    while (i <= e1 && i <= e2) {
      console.log("e1:", e1, "e2:", e2);
      const n1 = c1[e1];
      const n2 = c2[e2];
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, parentComponent, anchor);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    console.log(i, e1, e2);

    // 旧的子节点少于新的子节点 添加子节点
    if (i > e1 && i <= e2) {
      console.log("增加新子节点");
      // 需要新增描点
      const nextPos = e2 + 1;
      const anchor = nextPos < c2.length ? c2[nextPos].el : null;
      console.log(anchor, "anchor");

      while (i <= e2) {
        patch(null, c2[i], container, parentComponent, anchor);
        i++;
      }
    }
    // 新的子节点少于老的子节点, 删除老节点
    if (i > e2 && i <= e1) {
      console.log("删除老子节点");
      while (i <= e1) {
        hostRemove(c1[i].el);
        i++;
      }
    }
  }
  function unmountedChildren(children) {
    for (let i = 0; i < children.length; i++) {
      const el = children[i].el;

      hostRemove(el);
    }
  }

  function patchProps(el, oldProps, newProps) {
    if (oldProps !== newProps) {
      // 遍历新的
      for (const key in newProps) {
        const prevProp = oldProps[key];
        const nextProp = newProps[key];

        //如果不相等 就触发更新
        if (prevProp !== nextProp) {
          hostPatchProp(el, key, prevProp, nextProp);
        }
      }

      if (oldProps !== EMPTY_OBJ) {
        // 遍历老的
        for (const key in oldProps) {
          if (!(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null);
          }
        }
      }
    }
  }

  function mountChildren(vnode: any, container: any, parentComponent, anchor) {
    // throw new Error("Function not implemented.");
    const { children } = vnode;
    if (Array.isArray(children)) {
      children.forEach((child) => {
        patch(child.el, child, container, parentComponent, anchor);
      });
    }
  }
  function processFragment(vnode: any, container: any, parentComponent) {
    // 只渲染子元素
    mountChildren(vnode, container, parentComponent, null);
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
