import { Fragment } from "../renderer";
import { createVNode } from "../VNode";

export function renderSlots(slots, name, props) {
  const slot = slots[name];
  if (slot) {
    // 作用域插槽 slot 变成了一个函数
    if (typeof slot === "function") {
      return createVNode(Fragment, {}, slot(props));
    }
  }
}
