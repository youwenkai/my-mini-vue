export function emit(instance, eventName, ...args) {
  console.log(instance, eventName);

  const { props } = instance;

  // 组合事件名

  // 事件名第一个大写
  const capitalize = (str: string) =>
    str.charAt(0).toUpperCase() + str.slice(1);

  // 烤肉串方式 add-foo
  const cameLize = (str: string) =>
    str.replace(/-(\w)/g, (_, $1: string) => ($1 ? $1.toUpperCase() : ""));

  // 事件名添加上on开头
  const toHandlerKey = (str: string) => (str ? `on${capitalize(str)}` : "");

  const handlerName = toHandlerKey(cameLize(eventName));

  const handler = props[handlerName];

  handler && handler(...args);
}
