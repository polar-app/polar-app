// start a simple static HTTP server only listening on localhost

const express = require('express');
const serveStatic = require('serve-static');
const {Preconditions} = require("../../Preconditions");

class ProxyServer {

    constructor(proxyConfig, cacheRegistry) {

        this.proxyConfig = Preconditions.assertNotNull(proxyConfig, "proxyConfig");
        this.cacheRegistry = Preconditions.assertNotNull(cacheRegistry, "cacheRegistry");;

        this.app = null;
        this.server = null;

    }

    start() {

        this.app = express();

        this.server = this.app.listen(this.proxyConfig.port, "127.0.0.1");

        this.app.get(/.*/, function (req, res) {

            res.status(200).send("hello world");

        }.bind(this));

        console.log(`Proxy up and running on port ${this.proxyConfig.port}`);

    }

    stop() {
        this.server.close();
    }


}

module.exports.ProxyServer = ProxyServer;
