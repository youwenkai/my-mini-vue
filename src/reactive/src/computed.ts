// 需要收集getter中的依赖
// 如果依赖update了 需要重新计算即将_dirty标记更改

import { ReactiveEffect } from "./effect";

class ComputedRefImpl {
  private _dirty: any = true;
  private _value: any;
  private _effect: ReactiveEffect;
  constructor(getter: any) {
    // 当内部依赖update更新的时候 getter重新执行了
    // 在获取computed.value时又要 执行一次getter 也就是当依赖update时 执行了多余一次的getter
    // 为了避免这种情况 用effect的 scheduler
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
      }
    });
  }

  get value() {
    if (this._dirty) {
      this._dirty = false;
      this._value = this._effect.run();
    }
    return this._value;
  }
}

export function computed(getter) {
  return new ComputedRefImpl(getter);
}
