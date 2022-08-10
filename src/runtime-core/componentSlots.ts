import { isObject } from "../shared/index";
import { ShapeFlag } from "../shared/shapeFlags";

export function initSlots(instance, children) {
  const { vnode } = instance;
  if (vnode.shapeFlag & ShapeFlag.SLOT_CHILDREN) {
    normalizeObjectSlot(children, instance.slots);
  }
}

function normalizeObjectSlot(children: any, slots: any) {
  if (isObject(children)) {
    for (const key in children) {
      const child = children[key];
      slots[key] = (props) => normalizeSlotValue(child(props));
    }
  }
}

function normalizeSlotValue(child: any): any {
  return Array.isArray(child) ? child : [child];
}
