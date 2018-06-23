const http = require('http');
const fs = require('fs');
const assert = require('assert');

const {CacheRegistry} = require('./CacheRegistry');
const {ProxyServer} = require('./ProxyServer');
const {ProxyServerConfig} = require('./ProxyServerConfig');
const {Hashcodes} = require('../../Hashcodes');
const {assertJSON} = require("../../test/Assertions");


describe('Webserver', function() {

    describe('create', function() {

        it("basic", function () {

            let proxyServerConfig = new ProxyServerConfig(8090);
            let cacheRegistry = new CacheRegistry(proxyServerConfig);

            let proxyServer = new ProxyServer(proxyServerConfig, cacheRegistry);
            proxyServer.start();
            proxyServer.stop();

        });

    });

});
