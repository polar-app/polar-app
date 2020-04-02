import {assert} from 'chai';

import {ObjectPaths} from './ObjectPaths';
import {assertJSON} from '../test/Assertions';

describe('ObjectPaths', function() {

    describe('basic tests', function() {

        it("basic paths", function() {

            const obj: any = {};

            const objectPaths = ObjectPaths.recurse(obj);

            const expected: any = [
                {
                    "parent": null,
                    "parentKey": null,
                    "path": "/",
                    "value": {},
                },
            ];

            assertJSON(objectPaths, expected);

        });

        it("basic paths with one non-object field", function() {

            const obj = {
                "cat": "dog",
            };

            const objectPaths = ObjectPaths.recurse(obj);

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

            assertJSON(objectPaths, expected);

        });


        it("basic paths with one object", function() {

            const obj: any = {
                "cat": {
                    "name": "leo",
                },
            };

            const objectPaths = ObjectPaths.recurse(obj);

            assert.equal(objectPaths.length, 2);

            assert.equal(objectPaths[0].path, "/");
            assert.equal(objectPaths[1].path, "/cat");

        });

        it("basic paths with complex paths", function() {

            const obj: any = {
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

            const objectPaths = ObjectPaths.recurse(obj);

            assert.equal(objectPaths.length, 4);

            assert.equal(objectPaths[0].path, "/");
            assert.equal(objectPaths[1].path, "/cat");
            assert.equal(objectPaths[2].path, "/dog");
            assert.equal(objectPaths[3].path, "/dog/friend");

        });


    });

});
