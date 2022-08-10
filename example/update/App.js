import { h, ref } from "../../lib/runtime-core.esm.js";
export default {
  name: "App",
  setup() {
    const count = ref(0);
    const onClick = () => {
      count.value++;
    };

    return { count, onClick };
  },

  render() {
    return h("div", {}, [
      h("p", {}, `count: ${this.count}`),
      h("button", { onClick: this.onClick }, "点击"),
    ]);
  },
};
