class ReactiveEffect {
  private _fn: any;
  constructor(fn) {
    this._fn = fn;
  }
  run() {
    activeEffect = this;
    return this._fn();
  }
}

// 正在执行的effect
let activeEffect: any = null;

export function effect(fn) {
  // effect 收集的fn需要执行一次
  // 创建一个EffectReactive类
  const _effect = new ReactiveEffect(fn);

  _effect.run();

  return _effect.run.bind(_effect);
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

  deps.add(activeEffect);
}

export function trriger(target, key) {
  const depsMap = targetMap.get(target);
  const deps = depsMap.get(key);

  deps.forEach((effect) => {
    effect.run();
  });
}
