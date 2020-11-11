"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AmplitudeAnalytics = void 0;
const Analytics_1 = require("../Analytics");
const Platforms_1 = require("polar-shared/src/util/Platforms");
const Version_1 = require("polar-shared/src/util/Version");
const AppRuntime_1 = require("polar-shared/src/util/AppRuntime");
const Devices_1 = require("polar-shared/src/util/Devices");
function isBrowser() {
    return typeof window !== 'undefined';
}
function createAmplitude() {
    if (isBrowser()) {
        const amplitude = require('amplitude-js');
        amplitude.getInstance().init("c1374bb8854a0e847c0d85957461b9f0", null, {
            includeUtm: true,
            includeReferrer: true,
            saveEvents: true,
        });
        return amplitude;
    }
}
function createStandardEventsProperties() {
    const platform = Platforms_1.Platforms.toSymbol(Platforms_1.Platforms.get());
    const version = Version_1.Version.tokenized();
    const runtime = AppRuntime_1.AppRuntime.get();
    const device = Devices_1.Devices.get();
    return Object.assign(Object.assign({ platform }, version), { runtime, device });
}
const amplitude = createAmplitude();
const standardEventProperties = createStandardEventsProperties();
class AmplitudeAnalytics {
    event(event) {
        amplitude.getInstance().logEvent(event.category + '/' + event.action);
    }
    event2(event, data) {
        amplitude.getInstance().logEvent(event, Object.assign({ data }, standardEventProperties));
    }
    identify(userId) {
        amplitude.getInstance().setUserId(userId);
    }
    page(name) {
        amplitude.getInstance().logEvent('page:' + name);
    }
    traits(traits) {
        amplitude.getInstance().setUserProperties(traits);
    }
    version(version) {
        amplitude.getInstance().setVersionName(version);
    }
    heartbeat() {
        Analytics_1.Analytics.event2('heartbeat');
    }
}
exports.AmplitudeAnalytics = AmplitudeAnalytics;
//# sourceMappingURL=AmplitudeAnalytics.js.map