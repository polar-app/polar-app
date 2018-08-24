"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { Preconditions } = require("../../Preconditions");
class ProxyServerConfig {
    constructor(port) {
        this.port = Preconditions.assertNotNull(port, "port");
    }
}
exports.ProxyServerConfig = ProxyServerConfig;
//# sourceMappingURL=ProxyServerConfig.js.map