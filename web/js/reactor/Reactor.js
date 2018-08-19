"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Preconditions_1 = require("../Preconditions");
const Event_1 = require("./Event");
class Reactor {
    constructor() {
        this.events = {};
    }
    registerEvent(eventName) {
        Preconditions_1.Preconditions.assertNotNull(eventName, "eventName");
        if (this.events[eventName]) {
            return this;
        }
        let event = new Event_1.Event(eventName);
        this.events[eventName] = event;
        return this;
    }
    clearEvent(eventName) {
        let event = new Event_1.Event(eventName);
        this.events[eventName] = event;
        return this;
    }
    dispatchEvent(eventName, value) {
        Preconditions_1.Preconditions.assertNotNull(eventName, "eventName");
        this.events[eventName].getCallbacks().forEach(function (callback) {
            callback(value);
        });
        return this;
    }
    addEventListener(eventName, callback) {
        Preconditions_1.Preconditions.assertNotNull(eventName, "eventName");
        if (typeof callback !== "function") {
            throw new Error("Callback is not a function: " + typeof callback);
        }
        this.events[eventName].registerCallback(callback);
        return this;
    }
    getEventListeners(eventName) {
        Preconditions_1.Preconditions.assertNotNull(eventName, "eventName");
        return this.events[eventName].getCallbacks();
    }
}
exports.Reactor = Reactor;
//# sourceMappingURL=Reactor.js.map