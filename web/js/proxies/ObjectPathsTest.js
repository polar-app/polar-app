"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const ObjectPaths_1 = require("./ObjectPaths");
const Assertions_1 = require("../test/Assertions");
describe('ObjectPaths', function () {
    describe('basic tests', function () {
        it("basic paths", function () {
            const obj = {};
            const objectPaths = ObjectPaths_1.ObjectPaths.recurse(obj);
            const expected = [
                {
                    "parent": null,
                    "parentKey": null,
                    "path": "/",
                    "value": {},
                },
            ];
            Assertions_1.assertJSON(objectPaths, expected);
        });
        it("basic paths with one non-object field", function () {
            const obj = {
                "cat": "dog",
            };
            const objectPaths = ObjectPaths_1.ObjectPaths.recurse(obj);
            const expected = [
                {
                    "parent": null,
                    "parentKey": null,
                    "path": "/",
                    "value": {
                        "cat": "dog",
                    },
                },
            ];
            Assertions_1.assertJSON(objectPaths, expected);
        });
        it("basic paths with one object", function () {
            const obj = {
                "cat": {
                    "name": "leo",
                },
            };
            const objectPaths = ObjectPaths_1.ObjectPaths.recurse(obj);
            chai_1.assert.equal(objectPaths.length, 2);
            chai_1.assert.equal(objectPaths[0].path, "/");
            chai_1.assert.equal(objectPaths[1].path, "/cat");
        });
        it("basic paths with complex paths", function () {
            const obj = {
                "cat": {
                    "name": "leo",
                },
                "dog": {
                    "name": "christopher",
                    "friend": {
                        "name": "kevin",
                    },
                }
            };
            const objectPaths = ObjectPaths_1.ObjectPaths.recurse(obj);
            chai_1.assert.equal(objectPaths.length, 4);
            chai_1.assert.equal(objectPaths[0].path, "/");
            chai_1.assert.equal(objectPaths[1].path, "/cat");
            chai_1.assert.equal(objectPaths[2].path, "/dog");
            chai_1.assert.equal(objectPaths[3].path, "/dog/friend");
        });
    });
});
//# sourceMappingURL=ObjectPathsTest.js.map