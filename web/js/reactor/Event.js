"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Event = void 0;
class Event {
    constructor(name) {
        this.listeners = [];
        this.name = name;
    }
    registerListener(listener) {
        this.listeners.push(listener);
    }
    getListeners() {
        return this.listeners;
    }
    hasListeners() {
        return this.listeners.length > 0;
    }
    removeListener(listener) {
        const index = this.listeners.indexOf(listener);
        if (index > -1) {
            this.listeners.splice(index, 1);
            return true;
        }
        return false;
    }
    size() {
        return this.listeners.length;
    }
}
exports.Event = Event;
//# sourceMappingURL=Event.js.map