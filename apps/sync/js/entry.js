"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../../../web/js/logger/Logger");
const SyncApp_1 = require("../../../web/js/apps/sync/SyncApp");
const log = Logger_1.Logger.create();
let app = new SyncApp_1.SyncApp();
app.start()
    .catch(err => log.error("Could not start app: ", err));
//# sourceMappingURL=entry.js.map