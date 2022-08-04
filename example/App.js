import { h } from "../lib/runtime-core.esm.js";

export default {
  setup() {
    return {
      msg: "111",
    };
  },
  render() {
    return h("div", { id: "111" }, "hi, mini-vue");
  },
};
