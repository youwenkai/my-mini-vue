class RefImpl {
  private _value: any;
  constructor(value) {
    this._value = value;
  }

  get value() {
    return this._value;
  }

  set value(value) {
    this._value = value;
  }
}

export function ref(value) {
  return new RefImpl(value);
}
