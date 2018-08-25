"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProxyServerConfig_1 = require("./ProxyServerConfig");
const CacheRegistry_1 = require("./CacheRegistry");
const Logger_1 = require("../../logger/Logger");
const Preconditions_1 = require("../../Preconditions");
const debug = require('debug');
const net = require('net');
const http = require('http');
const express = require('express');
const serveStatic = require('serve-static');
const httpProxy = require('http-proxy');
const log = Logger_1.Logger.create();
class ProxyServer {
    constructor(proxyConfig, cacheRegistry) {
        this.proxyConfig = Preconditions_1.Preconditions.assertNotNull(proxyConfig, "proxyConfig");
        this.cacheRegistry = Preconditions_1.Preconditions.assertNotNull(cacheRegistry, "cacheRegistry");
        ;
        this.app = null;
        this.server = null;
    }
    start() {
        this.proxy = httpProxy.createProxyServer({});
        this.server = http.createServer(this.requestHandler.bind(this))
            .listen(this.proxyConfig.port, "127.0.0.1");
        this.server.on('upgrade', function (req, socket, head) {
            console.warn("UPGRADE not handled");
        });
        this.server.on('connect', this.secureRequestHandler.bind(this));
        log.info(`Proxy up and running on port ${this.proxyConfig.port}`);
    }
    stop() {
        this.server.close();
    }
    requestHandler(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            debug("Handling HTTP request: " + req.url);
            if (this.cacheRegistry.hasEntry(req.url)) {
                debug("Handling cached request: " + req.url);
                let cacheEntry = this.cacheRegistry.get(req.url);
                if (!cacheEntry) {
                    throw new Error("No cache entry for: " + req.url);
                }
                let headers = Object.assign({}, cacheEntry.headers);
                headers["X-polar-cache"] = "hit";
                if (cacheEntry.contentLength) {
                    headers["Content-Length"] = `${cacheEntry.contentLength}`;
                }
                res.writeHead(cacheEntry.statusCode, cacheEntry.statusMessage, headers);
                while (yield cacheEntry.handleData(function (data) {
                    res.write(data);
                }))
                    ;
                res.end();
                return;
            }
            debug("Handling proxied request: " + req.url);
            let options = {
                target: `${req.protocol}://${req.headers.host}`
            };
            this.proxy.web(req, res, options);
        });
    }
    secureRequestHandler(request, socketRequest, bodyhead) {
        debug("Handling SSL proxied request: " + request.url);
        let url = request['url'];
        let httpVersion = request['httpVersion'];
        let hostport = getHostPortFromString(url, 443);
        debug('  = will connect to %s:%s', hostport[0], hostport[1]);
        let proxySocket = new net.Socket();
        proxySocket.connect(parseInt(hostport[1]), hostport[0], function () {
            debug('  < connected to %s/%s', hostport[0], hostport[1]);
            debug('  > writing head of length %d', bodyhead.length);
            proxySocket.write(bodyhead);
            socketRequest.write("HTTP/" + httpVersion + " 200 Connection established\r\n\r\n");
        });
        proxySocket.on('data', function (chunk) {
            debug('  < data length = %d', chunk.length);
            socketRequest.write(chunk);
        });
        proxySocket.on('end', function () {
            debug('  < end');
            socketRequest.end();
        });
        socketRequest.on('data', function (chunk) {
            debug('  > data length = %d', chunk.length);
            proxySocket.write(chunk);
        });
        socketRequest.on('end', function () {
            debug('  > end');
            proxySocket.end();
        });
        proxySocket.on('error', function (err) {
            socketRequest.write("HTTP/" + httpVersion + " 500 Connection error\r\n\r\n");
            debug('  < ERR: %s', err);
            socketRequest.end();
        });
        socketRequest.on('error', function (err) {
            debug('  > ERR: %s', err);
            proxySocket.end();
        });
    }
}
exports.ProxyServer = ProxyServer;
const regex_hostport = /^([^:]+)(:([0-9]+))?$/;
function getHostPortFromString(hostString, defaultPort) {
    let host = hostString;
    let port = defaultPort;
    let result = regex_hostport.exec(hostString);
    if (result != null) {
        host = result[1];
        if (result[2] != null) {
            port = result[3];
        }
    }
    return ([host, port]);
}
function main() {
    log.info("Starting proxy...");
    let proxyServerConfig = new ProxyServerConfig_1.ProxyServerConfig(8090);
    let cacheRegistry = new CacheRegistry_1.CacheRegistry(proxyServerConfig);
    let proxyServer = new ProxyServer(proxyServerConfig, cacheRegistry);
    proxyServer.start();
}
if (require.main === module) {
    main();
}
//# sourceMappingURL=ProxyServer.js.map