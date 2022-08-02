import {
  isProxy,
  isReactive,
  isReadonly,
  reactive,
  readonly,
} from "../src/reactive";

describe("reactive", () => {
  it("happy path", () => {
    const original = { foo: 1 };
    const observed = reactive(original);
    expect(observed).not.toBe(original);
    expect(observed.foo).toBe(1);
  });

  it("isReactive", () => {
    const original = { foo: 1 };
    const observed = reactive(original);

    expect(isReactive(observed)).toBe(true);
    expect(isReactive(original)).toBe(false);
    expect(isReadonly(observed)).toBe(false);
  });
  it("isReadonly", () => {
    const original = { foo: 1 };
    const readonlyOnj = readonly(original);

    expect(isReactive(readonlyOnj)).toBe(false);
    expect(isReadonly(readonlyOnj)).toBe(true);
    expect(isReadonly(original)).toBe(false);
  });

  it("isProxy", () => {
    const original = { foo: 1 };
    const readonlyOnj = readonly(original);

    expect(isProxy(readonlyOnj)).toBe(true);
    expect(isProxy(original)).toBe(false);
  });

  test("nested reactive", () => {
    const original = { nested: { foo: 1 }, array: [{ bar: 2 }] };
    const ob = reactive(original);

    expect(isReactive(ob.nested)).toBe(true);
    expect(isReactive(ob.array)).toBe(true);
    expect(isReactive(ob.array[0])).toBe(true);
  });
});
