const http = require('http');
const fs = require('fs');
const assert = require('assert');
const url = require('url');
const {Caller} = require('./Caller');

describe('Caller', function() {

    describe('Test basic caller', () => {
        assert.equal(myCaller(), "myCaller");
    });

});

function myCaller() {
    // should return "myCaller"
    return Caller.getCaller();
}
