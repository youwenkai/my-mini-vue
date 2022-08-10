import { hasOwn } from "../shared/index";
import { getCurrentInstance } from "./component";

export function provide(key, value) {
  //存 存到当前实例对象上
  // 也就是说 这个函数只能在setup内使用

  const instance: any = getCurrentInstance();
  if (instance) {
    let { provides } = instance;
    // 每一层组件实例都需要自己的provide的存储空间,如果在此空间中找不到值
    // 则去父组件内寻找 类似于js中的原型链功能
    // 所以将可以模拟原型链 将此组件实例的provides原型 指向父级的provides
    const parentProvides = instance.parent && instance.parent.provides;

    // 在createComponentInstance时 赋值了父组件的provides
    // 用于判断是否当前的provides是否被赋值了
    if (provides === parentProvides) {
      // 只有初始化时 赋值
      provides = instance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}

export function inject(key, defaultValue) {
  //取 父组件取值
  const instance: any = getCurrentInstance();
  if (instance) {
    const { provides } = instance.parent;
    if (hasOwn(provides, key)) {
      return provides[key];
    } else if (defaultValue) {
      if (typeof defaultValue === "function") {
        return defaultValue();
      } else {
        return defaultValue;
      }
    } else {
      console.error("inject not find");
    }
  }
}
