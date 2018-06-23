const http = require('http');
const fs = require('fs');
const assert = require('assert');
const url = require('url');

const {CacheRegistry} = require('./CacheRegistry');
const {ProxyServer} = require('./ProxyServer');
const {ProxyServerConfig} = require('./ProxyServerConfig');
const {Hashcodes} = require('../../Hashcodes');
const {assertJSON} = require("../../test/Assertions");
const {Http} = require("../../util/Http");

var HttpProxyAgent = require('http-proxy-agent');
var HttpsProxyAgent = require('https-proxy-agent');

describe('ProxyServer', function() {

    describe('create', function() {

        it("basic", function () {

            let proxyServerConfig = new ProxyServerConfig(8090);
            let cacheRegistry = new CacheRegistry(proxyServerConfig);

            let proxyServer = new ProxyServer(proxyServerConfig, cacheRegistry);
            proxyServer.start();
            proxyServer.stop();

        });

        it("Proxy HTTP requests", async function () {

            let proxyServerConfig = new ProxyServerConfig(8090);
            let cacheRegistry = new CacheRegistry(proxyServerConfig);

            let proxyServer = new ProxyServer(proxyServerConfig, cacheRegistry);
            proxyServer.start();

            // https://nodejs.org/api/http.html#http_http_request_options_callback

            let options = url.parse("http://example.com");
            options.method = "GET";
            options.agent = new HttpProxyAgent("http://localhost:8090");

            console.log("options: ", options);

            let content = await Http.fetchContent(options);

            assert.equal(content.toString(), "hello world");

            proxyServer.stop();

        });


    });

});
