import { h, ref } from "../../lib/runtime-core.esm.js";

// diff算法
// 1. 左侧对比 a b c -> a b c d
// const prevChildren = [
//   h("p", { key: "A" }, "A"),
//   h("p", { key: "B" }, "B"),
//   h("p", { key: "C" }, "C"),
// ];

// const nextChildren = [
//   h("p", { key: "A" }, "A"),
//   h("p", { key: "B" }, "B"),
//   h("p", { key: "C" }, "C"),
//   h("p", { key: "D" }, "D"),
// ];
// 2. 右侧 a b c -> d a b c
// const prevChildren = [
//   h("p", { key: "A" }, "A"),
//   h("p", { key: "B" }, "B"),
//   h("p", { key: "C" }, "C"),
// ];

// const nextChildren = [
//   h("p", { key: "D" }, "D"),
//   h("p", { key: "A" }, "A"),
//   h("p", { key: "B" }, "B"),
//   h("p", { key: "C" }, "C"),
// ];

// 3. 新的比老的长
//     创建新的
// 左侧
// (a b)
// (a b) c
// i = 2, e1 = 1, e2 = 2
const prevChildren = [h("p", { key: "A" }, "A"), h("p", { key: "B" }, "B")];
const nextChildren = [
  h("p", { key: "A" }, "A"),
  h("p", { key: "B" }, "B"),
  h("p", { key: "C" }, "C"),
];

const isChange = ref(false);

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
      h(
        "button",
        {
          onClick: () => {
            isChange.value = !isChange.value;
          },
        },
        "测试子组件之间的 patch 逻辑"
      ),
      h("div", {}, isChange.value ? nextChildren : prevChildren),
    ]);
  },
};
