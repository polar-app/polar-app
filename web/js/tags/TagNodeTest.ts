import {assertJSON} from '../test/Assertions';
import {TagNodes} from './TagNode';
import {Tags} from './Tags';

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

            const tags = [
                '/',
                '/foo',
                '/foo/bar'
            ].map(current => Tags.create(current))
             .map(current => {
                    const count = Math.floor(Math.random() * 100);
                    return {...current, count};
                });

            assertJSON(TagNodes.create(...tags), {
                "children": [
                    {
                        "children": [
                            {
                                "children": [],
                                "id": 2,
                                "name": "bar",
                                "value": {
                                    "id": "/foo/bar",
                                    "label": "/foo/bar"
                                }
                            }
                        ],
                        "id": 1,
                        "name": "foo",
                        "value": {
                            "id": "/foo",
                            "label": "/foo"
                        }
                    }
                ],
                "id": 0,
                "name": "/",
                "value": {
                    "id": "/",
                    "label": "/"
                }
            });

        });

        it("empty", function() {

            assertJSON(TagNodes.create(), {
                "children": [],
                "id": 0,
                "name": "/",
                "value": {
                    "id": "/",
                    "label": "/"
                }
            });

        });

    });

});
