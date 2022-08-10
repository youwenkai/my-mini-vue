import { createApp, provide, h, inject } from "../../lib/runtime-core.esm.js";

const App = {
  setup() {
    provide("foo", "app foo");
    provide("bar", "app bar");
    return {};
  },
  render() {
    const app = h("div", {}, "app");
    const fooTwo = h(FooTwo);
    return h("div", {}, [app, fooTwo]);
  },
};

const FooTwo = {
  setup() {
    provide("foo", "fooTow foo");
    const app = inject("foo");
    return { app };
  },
  render() {
    const two = h("div", {}, this.app);
    const foo = h(Foo);
    return h("div", {}, [two, foo]);
  },
};

const Foo = {
  setup() {
    const foo = inject("foo");

    return { foo };
  },
  render() {
    return h("p", {}, this.foo);
  },
};

createApp(App).mount("#app");
