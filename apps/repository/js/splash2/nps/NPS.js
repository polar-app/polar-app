"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.NPS = exports.PREF_KEY = void 0;
const ISODateTimeStrings_1 = require("polar-shared/src/metadata/ISODateTimeStrings");
const TimeDurations_1 = require("polar-shared/src/util/TimeDurations");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Version_1 = require("polar-shared/src/util/Version");
const LifecycleToggle_1 = require("../../../../../web/js/ui/util/LifecycleToggle");
const LocalPrefs_1 = require("../../../../../web/js/util/LocalPrefs");
const log = Logger_1.Logger.create();
exports.PREF_KEY = 'net-promoter-score';
class NPS {
    constructor(userState) {
        this.userState = userState;
    }
    hasMinimumUsage() {
        const { datastoreCreated } = this.userState;
        if (datastoreCreated) {
            const since = ISODateTimeStrings_1.ISODateTimeStrings.parse(datastoreCreated);
            if (TimeDurations_1.TimeDurations.hasElapsed(since, '1w')) {
                return true;
            }
        }
        return false;
    }
    hasExpired() {
        return !LocalPrefs_1.LocalPrefs.isDelayed(exports.PREF_KEY, '1w');
    }
    shouldShow() {
        const hasMinimumUsage = this.hasMinimumUsage();
        const hasExpired = this.hasExpired();
        return hasMinimumUsage && hasExpired;
    }
    doShow() {
        const shouldShow = this.shouldShow();
        log.debug("doShow history: ", { shouldShow });
        return !shouldShow;
    }
    static markShown() {
        const version = Version_1.Version.get();
        log.debug("Marking version shown: " + version);
        LifecycleToggle_1.LifecycleToggle.set(exports.PREF_KEY, version);
    }
}
exports.NPS = NPS;
//# sourceMappingURL=NPS.js.map