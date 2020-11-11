"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const Attributes_1 = require("./Attributes");
const jsdom_1 = require("jsdom");
describe('Attributes', function () {
    describe('parse', function () {
        it("get", function () {
            const dom = new jsdom_1.JSDOM("<body><div data-foo='bar' data-cat-dog='dog' data-one-two-three-four='dog'></div></body>");
            console.log(dom.window.document.body.firstChild);
            const body = dom.window.document.body;
            const div = body.firstElementChild;
            const dataAttributeMap = Attributes_1.Attributes.dataToMap(div);
            chai_1.assert.deepEqual(dataAttributeMap, {
                foo: 'bar',
                catDog: 'dog',
                oneTwoThreeFour: 'dog'
            });
        });
    });
});
//# sourceMappingURL=AttributesTest.js.map