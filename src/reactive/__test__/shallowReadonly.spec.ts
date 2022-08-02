import { isReactive, shallowReadonly } from "../src/reactive";

describe("shallowReadobly", () => {
  test("should not make non-reactive properties reactive", () => {
    const props = shallowReadonly({ n: { foo: 1 } });
    expect(isReactive(props.n)).toBe(false);
  });

  it("shallowReadobly not to be set", () => {
    const obj = shallowReadonly({ age: 10 });
    console.warn = jest.fn();
    obj.age = 11;
    expect(obj.age).toBe(10);
    expect(console.warn).toBeCalled();
  });
});
