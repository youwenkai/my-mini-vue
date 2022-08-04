import { h } from "../lib/runtime-core.esm.js";

export default {
  setup() {
    return {
      msg: "111",
    };
  },
  render() {
    return h("div", { id: "111" }, [
      h("div", { id: 222 }, "hi"),
      h("div", { id: 333 }, "mini-vue"),
    ]);
  },
};
