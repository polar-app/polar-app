"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoMigration = void 0;
const LocalPrefs_1 = require("../../../../../web/js/util/LocalPrefs");
var TwoMigration;
(function (TwoMigration) {
    const KEY = 'two-migration';
    function shouldShow() {
        return !LocalPrefs_1.LocalPrefs.isMarked(KEY);
    }
    TwoMigration.shouldShow = shouldShow;
    function markShown() {
        LocalPrefs_1.LocalPrefs.mark(KEY);
    }
    TwoMigration.markShown = markShown;
})(TwoMigration = exports.TwoMigration || (exports.TwoMigration = {}));
//# sourceMappingURL=TwoMigration.js.map