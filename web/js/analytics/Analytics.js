"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analytics = exports.isBrowser = void 0;
const CompositeAnalytics_1 = require("./CompositeAnalytics");
const GAAnalytics_1 = require("./ga/GAAnalytics");
const NullAnalytics_1 = require("./null/NullAnalytics");
const AmplitudeAnalytics_1 = require("./amplitude/AmplitudeAnalytics");
const FirestoreAnalytics_1 = require("./firestore/FirestoreAnalytics");
const OnlineAnalytics_1 = require("./online/OnlineAnalytics");
function isBrowser() {
    return typeof window !== 'undefined';
}
exports.isBrowser = isBrowser;
function createDelegate() {
    if (isBrowser()) {
        return new OnlineAnalytics_1.OnlineAnalytics(new CompositeAnalytics_1.CompositeAnalytics([
            new AmplitudeAnalytics_1.AmplitudeAnalytics(),
            new GAAnalytics_1.GAAnalytics(),
            new FirestoreAnalytics_1.FirestoreAnalytics()
        ]));
    }
    else {
        return new NullAnalytics_1.NullAnalytics();
    }
}
const delegate = createDelegate();
class Analytics {
    static event(event) {
        delegate.event(event);
    }
    static event2(event, data) {
        delegate.event2(event, data);
    }
    static identify(userId) {
        delegate.identify(userId);
    }
    static page(name) {
        delegate.page(name);
    }
    static traits(map) {
        delegate.traits(map);
    }
    static version(version) {
        delegate.version(version);
    }
    static heartbeat() {
        delegate.heartbeat();
    }
}
exports.Analytics = Analytics;
//# sourceMappingURL=Analytics.js.map