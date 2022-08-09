import { h } from "../../lib/runtime-core.esm.js";

export default {
  name: "Foo",
  setup(props) {
    // 1. props.count;
    console.log(props);

    // props 不可修改 shallow readonly
    props.count++;
  },

  render() {
    // 2. 通过this.count访问
    return h("div", {}, `foo:${this.count}`);
  },
};
