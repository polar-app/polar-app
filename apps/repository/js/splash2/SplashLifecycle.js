"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SplashLifecycle = void 0;
const LocalPrefs_1 = require("../../../../web/js/util/LocalPrefs");
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
class SplashLifecycle {
    static canShow() {
        if (!navigator.onLine) {
            log.debug("Not showing due to not being online");
            return false;
        }
        if (LocalPrefs_1.LocalPrefs.isDelayed(SplashLifecycle.KEY, SplashLifecycle.DELAY)) {
            log.debug("Splash is delayed due to " + SplashLifecycle.KEY);
            return false;
        }
        return true;
    }
    static markShown() {
        LocalPrefs_1.LocalPrefs.markDelayed(this.KEY, SplashLifecycle.DELAY);
    }
    static computeDelay() {
        return LocalPrefs_1.LocalPrefs.computeDelay(this.KEY);
    }
}
exports.SplashLifecycle = SplashLifecycle;
SplashLifecycle.KEY = 'splash-shown';
SplashLifecycle.DELAY = '1d';
//# sourceMappingURL=SplashLifecycle.js.map