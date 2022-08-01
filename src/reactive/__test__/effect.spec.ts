import { effect } from "../src/effect";
import { reactive } from "../src/reactive";

describe("effect", () => {
  it("happy path", () => {
    const user = reactive({ age: 10 });

    let nextAge;
    // effect 执行一次
    // 执行时 收集依赖
    effect(() => (nextAge = user.age + 1));

    expect(nextAge).toBe(11);
    user.age++;
    expect(nextAge).toBe(12);
  });

  it("should return runner when call effect", () => {
    let foo = 10;
    const runner = effect(() => {
      foo++;
      return "foo";
    });
    expect(foo).toBe(11);

    const r = runner();
    expect(r).toBe("foo");
    expect(foo).toBe(12);
  });
});
