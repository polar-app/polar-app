const {Preconditions} = require("../../Preconditions");

class ProxyServerConfig {

    constructor(port) {
        this.port = Preconditions.assertNotNull(port, "port");
    }

}

module.exports.ProxyServerConfig = ProxyServerConfig;
