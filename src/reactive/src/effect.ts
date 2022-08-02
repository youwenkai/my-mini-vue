import { extend } from "../../shared";

class ReactiveEffect {
  private _fn: any;
  deps: any[] = [];
  active = true;
  onStop?: () => void;
  constructor(fn, public scheduler?: any) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }

  // 从依赖dep内删除该effect
  // 怎么知道effect存在哪个dep呢？
  // 需要在收集依赖时 反向绑定一下dep
  stop() {
    // 频繁调用stop时 会多次清空
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep) => {
    dep.delete(effect);
  });
}

// 正在执行的effect
let activeEffect: any = null;
// // 是否需要收集依赖
// let shouldTrack: any = null;

export function effect(fn, options: any = {}) {
  // effect 收集的fn需要执行一次
  // 创建一个EffectReactive类
  const _effect = new ReactiveEffect(fn, options?.scheduler);
  // 合并options
  // Object.assign(_effect, options);
  extend(_effect, options);

  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;
  _effect.run();

  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}

const targetMap = new Map();
export function track(target, key) {
  // target -> key -> dep

  let depsMap = targetMap.get(target);
  if (!depsMap) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let deps = depsMap.get(key);
  if (!deps) {
    deps = new Set();
    depsMap.set(key, deps);
  }

  if (!activeEffect) return;
  // if (!shouldTrack) return;

  deps.add(activeEffect);
  // 将当前effect 属于哪个dep 注入到effect内
  // 方便操作effect实例时 知道哪些依赖

  // 如果是单纯的reactive响应式时 activeEffect是undefined
  activeEffect.deps.push(deps);
}

export function trriger(target, key) {
  const depsMap = targetMap.get(target);
  const deps = depsMap.get(key);

  deps.forEach((effect) => {
    // 在update的时候 要去检查effect是否有调度器 scheduler
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  });
}
