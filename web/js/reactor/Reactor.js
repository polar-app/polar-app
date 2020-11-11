"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Reactor = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Event_1 = require("./Event");
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
class Reactor {
    constructor() {
        this.events = {};
    }
    registerEvent(eventName) {
        Preconditions_1.Preconditions.assertNotNull(eventName, "eventName");
        if (Preconditions_1.isPresent(this.events[eventName])) {
            return this;
        }
        const event = new Event_1.Event(eventName);
        this.events[eventName] = event;
        return this;
    }
    hasRegisteredEvent(eventName) {
        return Preconditions_1.isPresent(this.events[eventName]);
    }
    eventNames() {
        return Object.keys(this.events);
    }
    clearEvent(eventName) {
        const event = new Event_1.Event(eventName);
        this.events[eventName] = event;
        return this;
    }
    size(eventName) {
        if (this.events[eventName]) {
            return this.events[eventName].size();
        }
        return 0;
    }
    dispatchEvent(eventName, value) {
        Preconditions_1.Preconditions.assertNotNull(eventName, "eventName");
        const event = this.events[eventName];
        if (!event) {
            throw new Error("No events for event name: " + eventName);
        }
        event.getListeners().forEach((listener) => {
            try {
                listener(value);
            }
            catch (e) {
                log.error("listener generated unhandled exception: ", e);
            }
        });
        return this;
    }
    addEventListener(eventName, eventListener) {
        Preconditions_1.Preconditions.assertNotNull(eventName, "eventName");
        if (typeof eventListener !== "function") {
            throw new Error("listener is not a function: " + typeof eventListener);
        }
        if (this.events[eventName] === undefined) {
            throw new Error("No registered event for event name: " + eventName);
        }
        this.events[eventName].registerListener(eventListener);
        const release = () => {
            this.removeEventListener(eventName, eventListener);
        };
        return { eventListener, release };
    }
    removeEventListener(eventName, listener) {
        if (this.events[eventName]) {
            return this.events[eventName].removeListener(listener);
        }
        return false;
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
    getEventListeners(eventName) {
        Preconditions_1.Preconditions.assertNotNull(eventName, "eventName");
        return this.events[eventName].getListeners();
    }
    hasEventListeners(eventName) {
        return this.hasRegisteredEvent(eventName) && this.events[eventName].hasListeners();
    }
}
exports.Reactor = Reactor;
//# sourceMappingURL=Reactor.js.map