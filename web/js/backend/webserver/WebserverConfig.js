"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Preconditions_1 = require("../../Preconditions");
class WebserverConfig {
    constructor(dir, port) {
        this.dir = Preconditions_1.Preconditions.assertNotNull(dir, "dir");
        this.port = Preconditions_1.Preconditions.assertNotNull(port, "port");
    }
}
exports.WebserverConfig = WebserverConfig;
//# sourceMappingURL=WebserverConfig.js.map