"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Event {
    constructor(name) {
        this.callbacks = [];
        this.name = name;
    }
    registerCallback(callback) {
        this.callbacks.push(callback);
    }
    getCallbacks() {
        return this.callbacks;
    }
}
exports.Event = Event;
//# sourceMappingURL=Event.js.map