import assert from 'assert';
import {Attributes} from './Attributes';
const {JSDOM} = require("jsdom");

describe('Attributes', function() {

    describe('parse', function() {

        // must be disabled for now as JSDOM uses 100% cpu during tests.
        it("get", function () {

            let dom = new JSDOM("<body><div data-foo='bar' data-cat-dog='dog' data-one-two-three-four='dog'></div></body>");

            console.log(dom.window.document.body.firstChild);

            let dataAttributeMap = Attributes.dataToMap(dom.window.document.body.firstChild);

            assert.deepEqual(dataAttributeMap, {
                foo: 'bar',
                catDog: 'dog',
                oneTwoThreeFour: 'dog'
            });

        });

    });

});
