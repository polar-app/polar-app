// start a simple static HTTP server only listening on localhost

import {ProxyServerConfig} from './ProxyServerConfig';
import {CacheRegistry} from './CacheRegistry';
import {Logger} from '../../logger/Logger';
import {Preconditions} from '../../Preconditions';

const net = require('net');
const http = require('http');
const express = require('express');
const serveStatic = require('serve-static');
const httpProxy = require('http-proxy');

const log = Logger.create();

export class ProxyServer {

    proxyConfig: ProxyServerConfig;
    cacheRegistry: CacheRegistry

    app: any;
    server: any;
    proxy: any;

    constructor(proxyConfig: ProxyServerConfig, cacheRegistry: CacheRegistry) {

        this.proxyConfig = Preconditions.assertNotNull(proxyConfig, "proxyConfig");
        this.cacheRegistry = Preconditions.assertNotNull(cacheRegistry, "cacheRegistry");;

        this.app = null;
        this.server = null;

    }

    start() {

        this.proxy = httpProxy.createProxyServer({});

        this.server = http.createServer(this.requestHandler.bind(this))
                          .listen(this.proxyConfig.port, "127.0.0.1");

        this.server.on('upgrade', function (req: any, socket: any, head: any) {
            console.warn("UPGRADE not handled");
        });

        this.server.on('connect', this.secureRequestHandler.bind(this));

        log.info(`Proxy up and running on port ${this.proxyConfig.port}`);

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
    async requestHandler(req: any, res: any) {

        // debug("Handling HTTP request: " + req.url);

        if(this.cacheRegistry.hasEntry(req.url)) {

            // serve from the cache if registered

            // debug("Handling cached request: " + req.url);

            // TODO: the downside of this strategy is that we don't benefit
            // from any advanced HTTP caching semantics or features like
            // conditional GET requests but since we're local anyway this
            // does not impact performance.

            let cacheEntry = this.cacheRegistry.get(req.url);

            if(!cacheEntry) {
                throw new Error("No cache entry for: " + req.url);
            }

            const headers: {[key: string]: string | string[]} = Object.assign({}, cacheEntry.headers);

            headers["X-polar-cache"] = "hit";

            if(cacheEntry.contentLength) {
                // we should return contentLength too when it is known
                headers["Content-Length"] = `${cacheEntry.contentLength}`;
            }

            res.writeHead(cacheEntry.statusCode,
                          cacheEntry.statusMessage,
                          headers);

            while(await cacheEntry.handleData(function (data) {
                res.write(data);
            }));

            res.end();

            return;

        }

        // debug("Handling proxied request: " + req.url);

        // then forward to the remote proxy

        let options = {
            target: `${req.protocol}://${req.headers.host}`
        };

        this.proxy.web(req, res, options);

    }

    /**
     * Borrowed from:
     *
     * https://newspaint.wordpress.com/2012/11/05/node-js-http-and-https-proxy/
     *
     *
     *
     * @param request
     * @param socketRequest
     * @param bodyhead
     */
    secureRequestHandler(request: any, socketRequest: any, bodyhead: any) {

        // debug("Handling SSL proxied request: " + request.url);

        let url = request['url'];
        let httpVersion = request['httpVersion'];

        let hostport = getHostPortFromString(url, 443);

        // debug( '  = will connect to %s:%s', hostport[0], hostport[1] );

        // set up TCP connection
        let proxySocket = new net.Socket();
        proxySocket.connect(
            parseInt( hostport[1] ), hostport[0],
            function () {
                // debug( '  < connected to %s/%s', hostport[0], hostport[1] );
                // debug( '  > writing head of length %d', bodyhead.length );

                proxySocket.write( bodyhead );

                // tell the caller the connection was successfully established
                socketRequest.write( "HTTP/" + httpVersion + " 200 Connection established\r\n\r\n" );

            }

        );

        proxySocket.on('data', function ( chunk: any ) {
                // debug( '  < data length = %d', chunk.length );
                socketRequest.write( chunk );
            }
        );

        proxySocket.on('end', function () {
                // debug( '  < end' );
                socketRequest.end();
            }
        );

        socketRequest.on('data', function ( chunk: any ) {
                // debug( '  > data length = %d', chunk.length );

                proxySocket.write( chunk );
            }
        );

        socketRequest.on('end', function () {
                // debug( '  > end' );

                proxySocket.end();
            }
        );

        proxySocket.on('error', function ( err: any ) {
                socketRequest.write( "HTTP/" + httpVersion + " 500 Connection error\r\n\r\n" );
                // debug( '  < ERR: %s', err );
                socketRequest.end();
            }
        );

        socketRequest.on('error', function ( err: any ) {
                // debug( '  > ERR: %s', err );
                proxySocket.end();
            }
        );

    }

}

const regex_hostport = /^([^:]+)(:([0-9]+))?$/;

function getHostPortFromString( hostString: any, defaultPort: any ) {
    let host = hostString;
    let port = defaultPort;

    let result = regex_hostport.exec( hostString );
    if ( result != null ) {
        host = result[1];
        if ( result[2] != null ) {
            port = result[3];
        }
    }

    return( [ host, port ] );
}

function main() {
    log.info("Starting proxy...");
    let proxyServerConfig = new ProxyServerConfig(8090);
    let cacheRegistry = new CacheRegistry(proxyServerConfig);
    let proxyServer = new ProxyServer(proxyServerConfig, cacheRegistry);
    proxyServer.start();

}

if (require.main === module) {
    main();
}
