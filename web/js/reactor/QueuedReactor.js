"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QueuedReactor = void 0;
const Reactor_1 = require("./Reactor");
const Preconditions_1 = require("polar-shared/src/Preconditions");
class QueuedReactor {
    constructor(delegate = new Reactor_1.Reactor()) {
        this.queue = {};
        this.delegate = delegate;
    }
    addEventListener(eventName, eventListener) {
        this.delegate.addEventListener(eventName, eventListener);
        if (this.hasEnqueued(eventName)) {
            for (const current of this.clearEnqueued(eventName)) {
                this.delegate.dispatchEvent(eventName, current);
            }
        }
        const release = () => {
            this.removeEventListener(eventName, eventListener);
        };
        return { eventListener, release };
    }
    once(eventName) {
        return new Promise((resolve => {
            const listener = (event) => {
                resolve(event);
                this.removeEventListener(eventName, listener);
            };
            this.addEventListener(eventName, listener);
        }));
    }
    dispatchEvent(eventName, value) {
        if (this.delegate.hasEventListeners(eventName)) {
            this.delegate.dispatchEvent(eventName, value);
        }
        else {
            this.enqueue(eventName, value);
        }
    }
    getEventListeners(eventName) {
        return this.delegate.getEventListeners(eventName);
    }
    hasEventListeners(eventName) {
        return this.delegate.hasEventListeners(eventName);
    }
    registerEvent(eventName) {
        this.delegate.registerEvent(eventName);
        return this;
    }
    hasRegisteredEvent(eventName) {
        return this.delegate.hasRegisteredEvent(eventName);
    }
    clearEvent(eventName) {
        this.delegate.clearEvent(eventName);
    }
    removeEventListener(eventName, listener) {
        return this.delegate.removeEventListener(eventName, listener);
    }
    size(eventName) {
        return this.delegate.size(eventName);
    }
    enqueue(eventName, value) {
        if (!Preconditions_1.isPresent(this.queue[eventName])) {
            this.queue[eventName] = [];
        }
        this.queue[eventName].push(value);
        return this;
    }
    clearEnqueued(eventName) {
        if (Preconditions_1.isPresent(this.queue[eventName])) {
            const data = this.queue[eventName];
            delete this.queue[eventName];
            return data;
        }
        else {
            return [];
        }
    }
    hasEnqueued(eventName) {
        return Preconditions_1.isPresent(this.queue[eventName]) && this.queue[eventName].length > 0;
    }
}
exports.QueuedReactor = QueuedReactor;
//# sourceMappingURL=QueuedReactor.js.map