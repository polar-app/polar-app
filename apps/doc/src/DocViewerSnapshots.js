"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocViewerSnapshots = void 0;
const UUIDs_1 = require("../../../web/js/metadata/UUIDs");
var DocViewerSnapshots;
(function (DocViewerSnapshots) {
    function isStaleUpdate(current, updated) {
        if (!current) {
            return false;
        }
        return UUIDs_1.UUIDs.compare(current, updated) >= 0;
    }
    DocViewerSnapshots.isStaleUpdate = isStaleUpdate;
    function computeUpdateType(current, updated) {
        return DocViewerSnapshots.isStaleUpdate(current, updated) ? 'stale' : 'fresh';
    }
    DocViewerSnapshots.computeUpdateType = computeUpdateType;
    function computeUpdateType2(current, updated) {
        if (!current) {
            return 'fresh';
        }
        const cmp = UUIDs_1.UUIDs.compare(current, updated);
        if (cmp > 0) {
            return 'stale';
        }
        return 'self';
    }
    DocViewerSnapshots.computeUpdateType2 = computeUpdateType2;
    function computeUpdateType3(current, updated) {
        if (!current) {
            return {
                cmp: undefined,
                type: 'fresh'
            };
        }
        const cmp = UUIDs_1.UUIDs.compare2(current, updated);
        if (cmp < 0) {
            return {
                cmp,
                type: 'stale'
            };
        }
        if (cmp > 0) {
            return {
                cmp,
                type: 'fresh'
            };
        }
        return {
            cmp,
            type: 'self'
        };
    }
    DocViewerSnapshots.computeUpdateType3 = computeUpdateType3;
})(DocViewerSnapshots = exports.DocViewerSnapshots || (exports.DocViewerSnapshots = {}));
//# sourceMappingURL=DocViewerSnapshots.js.map