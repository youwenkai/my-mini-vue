import { isReactive, isReadonly, reactive, readonly } from "../src/reactive";

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
});
