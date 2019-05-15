import {assertJSON} from '../test/Assertions';
import {TagNodes} from './TagNode';

describe('TagNode', function() {

    it("split", function() {

        assertJSON(TagNodes.split("/foo"), [
            {
                "path": "/",
                "basename": ""
            },
            {
                "path": "/foo",
                "basename": "foo",
                "parent": {
                    "path": "/",
                    "basename": ""
                }
            }
        ]);

        assertJSON(TagNodes.split("/foo/bar"), [
            {
                "path": "/",
                "basename": ""
            },
            {
                "path": "/foo",
                "basename": "foo",
                "parent": {
                    "path": "/",
                    "basename": ""
                }
            },
            {
                "path": "/foo/bar",
                "basename": "bar",
                "parent": {
                    "path": "/foo",
                    "basename": "foo"
                }
            }
        ]);

        assertJSON(TagNodes.split("/Hello World/The Dog"), [
            {
                "path": "/",
                "basename": ""
            },
            {
                "path": "/Hello World",
                "basename": "Hello World",
                "parent": {
                    "path": "/",
                    "basename": ""
                }
            },
            {
                "path": "/Hello World/The Dog",
                "basename": "The Dog",
                "parent": {
                    "path": "/Hello World",
                    "basename": "Hello World"
                }
            }
        ]);

    });

    describe("create", function() {

        it("basic", function() {

            assertJSON(TagNodes.create('/',
                                       '/foo',
                                       '/foo/bar'), {
                "children": [
                    {
                        "children": [
                            {
                                "children": [],
                                "label": "bar"
                            }
                        ],
                        "label": "foo"
                    }
                ],
                "label": "/"
            });

        });

        it("empty", function() {

            assertJSON(TagNodes.create(), {
                           "children": [
                           ],
                           "label": "/"
                       });

        });

        it("empty", function() {

            assertJSON(TagNodes.create(), {
                "children": [
                ],
                "label": "/"
            });

        });

    });

});
