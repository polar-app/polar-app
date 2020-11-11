"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CompositeAnalytics = void 0;
class CompositeAnalytics {
    constructor(delegates) {
        this.delegates = delegates;
    }
    event(event) {
        this.invoke(delegate => delegate.event(event));
    }
    event2(event, data) {
        this.invoke(delegate => delegate.event2(event, data));
    }
    identify(userId) {
        this.invoke(delegate => delegate.identify(userId));
    }
    page(name) {
        this.invoke(delegate => delegate.page(name));
    }
    traits(map) {
        this.invoke(delegate => delegate.traits(map));
    }
    version(version) {
        this.invoke(delegate => delegate.version(version));
    }
    heartbeat() {
        this.invoke(delegate => delegate.heartbeat());
    }
    invoke(handler) {
        for (const delegate of this.delegates) {
            try {
                handler(delegate);
            }
            catch (e) {
                console.error(e);
            }
        }
    }
}
exports.CompositeAnalytics = CompositeAnalytics;
//# sourceMappingURL=CompositeAnalytics.js.map