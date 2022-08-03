import { computed } from "../src/computed";
import { reactive } from "../src/reactive";

describe("computed", () => {
  it("happy path", () => {
    const user = reactive({ age: 1 });

    const age = computed(() => user.age);

    expect(age.value).toBe(1);
  });

  it("should compute lazily", () => {
    const value = reactive({});
    const getter = jest.fn(() => value.foo);
    const cValue = computed(getter);

    // lazy
    expect(getter).not.toHaveBeenCalled();

    expect(cValue.value).toBe(undefined);
    expect(getter).toHaveBeenCalledTimes(1);

    // // should not compute again
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(1);

    // // should not compute until needed
    value.foo = 1; // set -> trigger effect
    expect(getter).toHaveBeenCalledTimes(1);

    // // now it should compute
    expect(cValue.value).toBe(1);
    expect(getter).toHaveBeenCalledTimes(2);

    // should not compute again
    cValue.value;
    expect(getter).toHaveBeenCalledTimes(2);
  });
});
