"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MainAPI = void 0;
const Logger_1 = require("polar-shared/src/logger/Logger");
const Version_1 = require("polar-shared/src/util/Version");
const log = Logger_1.Logger.create();
const ALLOWED_ORIGIN = ['chrome-extension://nplbojledjdlbankapinifindadkdpnj',
    'chrome-extension://jkfdkjomocoaljglgddnmhcbolldcafd']
    .join(', ');
class MainAPI {
    constructor(mainAppController, webRequestHandler) {
        this.mainAppController = mainAppController;
        this.webRequestHandler = webRequestHandler;
    }
    start() {
        this.startCaptureTriggerHandler();
        this.startPingHandler();
    }
    startCaptureTriggerHandler() {
        const path = "/rest/v1/capture/trigger";
        this.webRequestHandler.options(path, (req, res) => {
            log.info("Handling OPTIONS request: ", req.headers);
            res.header('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            res.header('Access-Control-Allow-Methods', 'POST, OPTIONS');
            res.status(200).send({});
        });
        this.webRequestHandler.post(path, (req, res) => {
            log.info("Handling POST request for capture trigger: ", req.body);
            res.status(200).send({});
        });
    }
    startPingHandler() {
        const path = "/rest/v1/ping";
        this.webRequestHandler.post(path, (req, res) => {
            res.header('Access-Control-Allow-Origin', ALLOWED_ORIGIN);
            const timestamp = Date.now();
            const version = Version_1.Version.get();
            const data = {
                timestamp,
                version
            };
            res.status(200).send(data);
        });
    }
}
exports.MainAPI = MainAPI;
//# sourceMappingURL=MainAPI.js.map