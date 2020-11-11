"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WhatsNew = void 0;
const LifecycleEvents_1 = require("../../../../../web/js/ui/util/LifecycleEvents");
const Version_1 = require("polar-shared/src/util/Version");
const LocalPrefs_1 = require("../../../../../web/js/util/LocalPrefs");
var WhatsNew;
(function (WhatsNew) {
    function shouldShow() {
        const version = Version_1.Version.get();
        const prevVersion = LocalPrefs_1.LocalPrefs.get(LifecycleEvents_1.LifecycleEvents.WHATS_NEW_VERSION)
            .getOrElse(version);
        console.debug("Comparing versions: ", { version, prevVersion });
        return prevVersion !== version;
    }
    function markShown() {
        const version = Version_1.Version.get();
        console.debug("Marking version shown: " + version);
        LocalPrefs_1.LocalPrefs.set(LifecycleEvents_1.LifecycleEvents.WHATS_NEW_VERSION, version);
    }
    WhatsNew.markShown = markShown;
})(WhatsNew = exports.WhatsNew || (exports.WhatsNew = {}));
//# sourceMappingURL=WhatsNew.js.map