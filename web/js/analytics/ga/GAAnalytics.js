"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GAAnalytics = void 0;
const RendererAnalytics_1 = require("../../ga/RendererAnalytics");
class GAAnalytics {
    event(evt) {
        if (navigator.onLine) {
            RendererAnalytics_1.RendererAnalytics.event(evt);
        }
    }
    event2(event, data) {
    }
    page(name) {
        if (navigator.onLine) {
            RendererAnalytics_1.RendererAnalytics.pageview(name);
        }
    }
    identify(userId) {
    }
    traits(map) {
    }
    version(version) {
    }
    heartbeat() {
    }
}
exports.GAAnalytics = GAAnalytics;
//# sourceMappingURL=GAAnalytics.js.map