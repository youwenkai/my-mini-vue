import {
  getCurrentInstance,
  h,
  renderSlots,
} from "../../lib/runtime-core.esm.js";

export default {
  name: "Foo",
  setup(props, { emit }) {
    console.log(getCurrentInstance());
    return {};
  },

  render() {
    const c = h("p", {}, "foo");
    // console.log(this.$slots, "slots");
    // 作用域插槽
    const age = 18;
    return h("div", {}, [
      renderSlots(this.$slots, "header", { age }),
      c,
      renderSlots(this.$slots, "footer", { age }),
    ]);
  },
};
