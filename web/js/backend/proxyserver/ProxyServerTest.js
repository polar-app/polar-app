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

const HttpProxyAgent = require('http-proxy-agent');
const HttpsProxyAgent = require('https-proxy-agent');

describe('ProxyServer', function() {

    describe('create', function() {

        let proxyServer = null;

        beforeEach(function(done) {

            console.log("Starting...");

            let proxyServerConfig = new ProxyServerConfig(8090);
            let cacheRegistry = new CacheRegistry(proxyServerConfig);
            proxyServer = new ProxyServer(proxyServerConfig, cacheRegistry);
            proxyServer.start();

            console.log("Starting...done");

            done();

        });

        afterEach(function(done) {

            console.log("Stopping...");

            proxyServer.stop();

            console.log("Stopping...done");

            done();

        });

        it("basic", function () {

            // this is just basic startup and teardown.

        });

        it("Proxy HTTP requests", async function () {

            let agent = new HttpProxyAgent("http://localhost:8090");

            let link = "http://httpbin.org/get?message=hello+world";
            //let link = "http://example.com";

            let content = await testWithAgent(link, agent);
            assert.equal(content.toString().indexOf("hello world") > -1, true);

        });

        it("Proxy HTTPS requests", async function () {

            let agent = new HttpsProxyAgent("http://localhost:8090");

            let link = "https://httpbin.org/get?message=hello+world";

            let content = await testWithAgent(link, agent);
            assert.equal(content.toString().indexOf("hello world") > -1, true);

        });

    });

});


async function testWithAgent(link, agent) {

    let options = url.parse(link);
    options.method = "GET";
    options.agent = agent;

    console.log("options: ", options);

    let content = await Http.fetchContent(options);
    return content.toString();


}
