'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function createComponentInstance(vnode) {
    return { vnode, type: vnode.type };
}
function setupComponent(instance) {
    // TODO
    // initProps();
    // initSlots();
    // 处理setup
    setupStatefulComponent(instance);
}
function setupStatefulComponent(instance) {
    const Component = instance.type;
    const { setup } = Component;
    if (setup) {
        // setup 可以返回function / object
        const setupResult = setup();
        // 所以需要进一步处理
        handlerSetupResult(instance, setupResult);
    }
}
function handlerSetupResult(instance, setupResult) {
    if (typeof setupResult === "object") {
        instance.setupState = setupResult;
    }
    finishComponentSetup(instance);
}
function finishComponentSetup(instance) {
    // 开始render
    const Component = instance.type;
    if (Component.render) {
        instance.render = Component.render;
    }
}

function render(vnode, container) {
    patch(vnode);
}
function patch(vnode, container) {
    // 处理组件
    processComponent(vnode);
}
function processComponent(vnode, container) {
    // 挂载组件
    mountComponent(vnode);
}
function mountComponent(vnode) {
    // 生成组件实例
    const instance = createComponentInstance(vnode);
    //安装组件
    setupComponent(instance);
    //render
    setupRenderEffect(instance);
}
function setupRenderEffect(instance) {
    instance.render();
}

function createVNode(type, props, children) {
    return {
        type,
        props,
        children,
    };
}

function createApp(rootComponent) {
    return {
        mount(rootContainer) {
            document.querySelector(rootContainer);
            // 创建一个虚拟vnode
            const vnode = createVNode(rootComponent);
            // 渲染组件
            render(vnode);
        },
    };
}

function h(type, props, children) {
    return createVNode(type, props, children);
}

exports.createApp = createApp;
exports.h = h;
