import { readonly } from "../src/reactive";

describe("readobly", () => {
  it("happy path", () => {
    const original = { foo: 1, bar: { bar: 2 } };
    const wrapped = readonly(original);

    expect(wrapped).not.toBe(original);
    expect(wrapped.foo).toBe(1);
  });

  it("readonly not to be set", () => {
    const obj = readonly({ age: 10 });
    console.warn = jest.fn();
    obj.age = 11;
    expect(console.warn).toBeCalled();
  });
});
