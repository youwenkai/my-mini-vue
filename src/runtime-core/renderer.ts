import { createComponentInstance, setupComponent } from "./component";

export function render(vnode, container) {
  patch(vnode, container);
}

function patch(vnode: any, container: any) {
  // 处理组件
  processComponent(vnode, container);
}

function processComponent(vnode: any, container: any) {
  // 挂载组件
  mountComponent(vnode);
}

function mountComponent(vnode) {
  // 生成组件实例
  const instance = createComponentInstance(vnode);

  //安装组件
  setupComponent(instance);

  //render
  setupRenderEffect(instance);
}
export function setupRenderEffect(instance: any) {
  const subTree = instance.render();
}
