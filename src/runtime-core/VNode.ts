import { ShapeFlag } from "../shared/shapeFlags";
import { Text } from "./renderer";

export function createVNode(type, props?, children?) {
  const vnode = {
    type,
    props,
    key: props ? props.key : "",
    children,
    shapeFlag: getShapeFlag(type),
  };

  if (typeof children === "string") {
    vnode.shapeFlag |= ShapeFlag.TEXT_CHILDREN;
  } else if (Array.isArray(children)) {
    vnode.shapeFlag |= ShapeFlag.ARRAY_CHILDREN;
  }

  // 新增一个slot children 类型
  // 必须是 组件 + children 是 object
  if (vnode.shapeFlag & ShapeFlag.SETUPFUL_COMPONENT) {
    if (typeof children === "object") {
      vnode.shapeFlag |= ShapeFlag.SLOT_CHILDREN;
    }
  }

  return vnode;
}
function getShapeFlag(type: any) {
  return typeof type === "string"
    ? ShapeFlag.ELEMENT
    : ShapeFlag.SETUPFUL_COMPONENT;
}

export function createTextVNode(text: string) {
  return createVNode(Text, {}, text);
}
