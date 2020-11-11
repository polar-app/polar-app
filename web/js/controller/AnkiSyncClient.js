"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnkiSyncClient = void 0;
var AnkiSyncClient;
(function (AnkiSyncClient) {
    function start() {
        window.postMessage({ type: 'start-anki-sync' }, '*');
    }
    AnkiSyncClient.start = start;
})(AnkiSyncClient = exports.AnkiSyncClient || (exports.AnkiSyncClient = {}));
//# sourceMappingURL=AnkiSyncClient.js.map