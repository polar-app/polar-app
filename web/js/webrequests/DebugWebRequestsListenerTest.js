const http = require('http');
const fs = require('fs');
const assert = require('assert');
const url = require('url');

const {DebugWebRequestsListener} = require('./DebugWebRequestsListener');

describe('DebugWebRequestsListener', function() {

    describe('Test method call', function() {

        it("basic", function () {

            DebugWebRequestsListener.eventListener({ test: "test" })
        });

    });

});
