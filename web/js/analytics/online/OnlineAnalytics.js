"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OnlineAnalytics = void 0;
class OnlineAnalytics {
    constructor(delegate) {
        this.delegate = delegate;
    }
    event(evt) {
        if (navigator.onLine) {
            this.delegate.event(evt);
        }
    }
    event2(event, data) {
        if (navigator.onLine) {
            this.delegate.event2(event, data);
        }
    }
    page(name) {
        if (navigator.onLine) {
            this.delegate.page(name);
        }
    }
    identify(userId) {
        if (navigator.onLine) {
            this.delegate.identify(userId);
        }
    }
    traits(map) {
        if (navigator.onLine) {
            this.delegate.traits(map);
        }
    }
    version(version) {
        if (navigator.onLine) {
            this.delegate.version(version);
        }
    }
    heartbeat() {
        if (navigator.onLine) {
            this.delegate.heartbeat();
        }
    }
}
exports.OnlineAnalytics = OnlineAnalytics;
//# sourceMappingURL=OnlineAnalytics.js.map