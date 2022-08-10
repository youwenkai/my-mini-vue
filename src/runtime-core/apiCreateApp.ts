import { render } from "./renderer";
import { createVNode } from "./VNode";

export function createApp(rootComponent) {
  return {
    mount(rootContainer) {
      const container = document.querySelector(rootContainer);
      // 创建一个虚拟vnode
      const vnode = createVNode(rootComponent);

      // 渲染组件
      render(vnode, container, null);
    },
  };
}
