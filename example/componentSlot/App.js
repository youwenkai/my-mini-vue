import { createTextVNode, h } from "../../lib/runtime-core.esm.js";
import Foo from "./Foo.js";

export default {
  name: "app",
  setup() {
    return {
      msg: "setup msg mini-vue",
    };
  },
  render() {
    // 作用域插槽
    // 需要用到foo内部的参数, 在需要在slot时转成函数 将需要的参数传进函数内
    const app = h("div", {}, "app");
    const foo = h(
      Foo,
      {},
      {
        header: ({ age }) => [
          h("div", {}, "header" + age),
          createTextVNode("text 节点"),
        ],
        footer: () => h("div", {}, "footer"),
      }
    );
    // const foo = h(Foo, {}, h("div", {}, "slot 124"));
    return h("div", {}, [app, foo]);
  },
};
