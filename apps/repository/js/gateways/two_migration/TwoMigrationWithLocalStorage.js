"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TwoMigrationWithLocalStorage = void 0;
const LocalPrefs_1 = require("../../../../../web/js/util/LocalPrefs");
var TwoMigrationWithLocalStorage;
(function (TwoMigrationWithLocalStorage) {
    const KEY = 'two-migration';
    function shouldShow() {
        return !LocalPrefs_1.LocalPrefs.isMarked(KEY);
    }
    TwoMigrationWithLocalStorage.shouldShow = shouldShow;
    function markShown() {
        LocalPrefs_1.LocalPrefs.mark(KEY);
    }
    TwoMigrationWithLocalStorage.markShown = markShown;
})(TwoMigrationWithLocalStorage = exports.TwoMigrationWithLocalStorage || (exports.TwoMigrationWithLocalStorage = {}));
//# sourceMappingURL=TwoMigrationWithLocalStorage.js.map