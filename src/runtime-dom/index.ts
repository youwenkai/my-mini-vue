import { createRenderer } from "../runtime-core/index";

function createElement(type) {
  return document.createElement(type);
}

function patchProp(el, key, prevValue, nextValue) {
  const isOn = /^on[A-Z]/.test(key);
  if (isOn) {
    const eventName = key.slice(2).toLowerCase();
    el.addEventListener(eventName, nextValue);
  } else {
    if (nextValue === null || nextValue === undefined) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, nextValue);
    }
  }
}

function insert(child, parent, anchor) {
  // parent.append(el);
  parent.insertBefore(child, anchor || null);
}

function remove(child) {
  const parent = child.parentNode;
  if (parent) {
    parent.removeChild(child);
  }
}

function setElementText(el, text) {
  el.textContent = text;
}

const render: any = createRenderer({
  createElement,
  patchProp,
  insert,
  remove,
  setElementText,
});

export function createApp(...args) {
  return render.createApp(...args);
}
export * from "../runtime-core/index";
