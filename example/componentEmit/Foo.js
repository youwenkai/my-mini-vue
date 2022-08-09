import { h } from "../../lib/runtime-core.esm.js";

export default {
  name: "Foo",
  setup(props, { emit }) {
    const onEmitter = () => {
      console.log("foo: trigger event");
      emit("add", 1, 2);
      emit("add-foo");
    };

    return {
      onEmitter,
    };
  },

  render() {
    const button = h("button", { onClick: this.onEmitter }, "click me");
    return h("div", {}, [button]);
  },
};
