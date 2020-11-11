"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SimpleReactor = void 0;
const Reactor_1 = require("./Reactor");
const EVENT_NAME = 'event';
class SimpleReactor {
    constructor(delegate = new Reactor_1.Reactor()) {
        this.delegate = delegate;
        this.delegate.registerEvent(EVENT_NAME);
    }
    dispatchEvent(value) {
        this.delegate.dispatchEvent(EVENT_NAME, value);
    }
    clear() {
        this.delegate.clearEvent(EVENT_NAME);
    }
    addEventListener(eventListener) {
        return this.delegate.addEventListener(EVENT_NAME, eventListener);
    }
    once() {
        return this.delegate.once(EVENT_NAME);
    }
    removeEventListener(eventListener) {
        return this.delegate.removeEventListener(EVENT_NAME, eventListener);
    }
    size() {
        return this.delegate.size(EVENT_NAME);
    }
    getEventListeners() {
        return this.delegate.getEventListeners(EVENT_NAME);
    }
}
exports.SimpleReactor = SimpleReactor;
//# sourceMappingURL=SimpleReactor.js.map