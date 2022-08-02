import { hasChanged, isObject } from "../../shared";
import { isTracking, trackEffect, triggerEffect } from "./effect";
import { reactive } from "./reactive";

class RefImpl {
  private _value: any;
  private _deps: Set<any>;
  private _raw: any;
  constructor(value) {
    // this._value = value;
    this._raw = value;
    this._value = convert(value);
    this._deps = new Set();
  }

  // 通过get 方式去收集依赖 但是需要dep
  get value() {
    if (isTracking()) {
      // 在此处 收集依赖
      trackEffect(this._deps);
    }
    return this._value;
  }

  set value(newValue) {
    // 如果值没有update 则不需要触发依赖
    if (hasChanged(this._raw, newValue)) {
      this._raw = newValue;
      this._value = convert(newValue);
      // 触发依赖
      triggerEffect(this._deps);
    }
  }
}

function convert(value) {
  return isObject(value) ? reactive(value) : value;
}

// 响应式时针对对象处理
// 如果出现了基础类型 number string就不能生成响应式
// ref就是干这个
// 如果将对象分配为 ref 值，则它将被 reactive 函数处理为深层的响应式对象

export function ref(value) {
  return new RefImpl(value);
}
