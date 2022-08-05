import { h } from "../lib/runtime-core.esm.js";

window.self = null;
export default {
  setup() {
    return {
      msg: "setup msg mini-vue",
    };
  },
  render() {
    // return h("div", { id: "111" }, [
    //   h("div", { id: 222 }, "hi"),
    //   h("div", { id: 333 }, "mini-vue"),
    // ]);
    window.self = this;
    return h("div", { id: "111" }, "hi," + this.msg);
  },
};
