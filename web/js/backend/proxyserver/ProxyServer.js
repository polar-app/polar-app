// start a simple static HTTP server only listening on localhost

const express = require('express');
const serveStatic = require('serve-static');
const {Preconditions} = require("../../Preconditions");
const httpProxy = require('http-proxy');
const {ProxyServerConfig} = require('./ProxyServerConfig');
const {CacheRegistry} = require('./CacheRegistry');

class ProxyServer {

    constructor(proxyConfig, cacheRegistry) {

        this.proxyConfig = Preconditions.assertNotNull(proxyConfig, "proxyConfig");
        this.cacheRegistry = Preconditions.assertNotNull(cacheRegistry, "cacheRegistry");;

        this.app = null;
        this.server = null;

    }

    start() {

        this.app = express();
        this.proxy = httpProxy.createProxyServer({});


        this.server = this.app.listen(this.proxyConfig.port, "127.0.0.1");

        this.app.get(/.*/, this.requestHandler.bind(this));
        this.app.connect(/.*/, this.requestHandler.bind(this));

        console.log(`Proxy up and running on port ${this.proxyConfig.port}`);

    }

    stop() {
        this.server.close();
    }

    /**
     * Handle request from the cache, optionally forwarding to the origin
     * source if necessary.
     *
     * @param req https://expressjs.com/en/4x/api.html#req
     * @param res https://expressjs.com/en/4x/api.html#res
     */
    requestHandler(req, res) {

        console.log("FIXME: got request");

        //res.status(200).send("hello world");

        // forward to the original proxy URL now using req.hostname

        // FIXME: target needs the scheme

        let options = {
            // { target: 'http://example.com:443' }
            // FIXME: { target: 'http://example.com:80' }
            target: `${req.protocol}://${req.headers.host}`
            //target: "http://example.com:80"
        };

        console.log("FIXME:", options)

        this.proxy.web(req, res, options);

    }

}

module.exports.ProxyServer = ProxyServer;

function main() {
    console.log("Starting proxy...");
    let proxyServerConfig = new ProxyServerConfig(8090);
    let cacheRegistry = new CacheRegistry(proxyServerConfig);
    let proxyServer = new ProxyServer(proxyServerConfig, cacheRegistry);
    proxyServer.start();

}

if (require.main === module) {
    main();
}
