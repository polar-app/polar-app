"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Assertions_1 = require("../test/Assertions");
const Tags_1 = require("polar-shared/src/tags/Tags");
const TagPaths_1 = require("./TagPaths");
const TagNodes_1 = require("./TagNodes");
describe('TagNode', function () {
    it("split", function () {
        Assertions_1.assertJSON(TagPaths_1.TagPaths.createPathEntries("/foo"), [
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
        Assertions_1.assertJSON(TagPaths_1.TagPaths.createPathEntries("/foo/bar"), [
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
        Assertions_1.assertJSON(TagPaths_1.TagPaths.createPathEntries("/Hello World/The Dog"), [
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
    describe("create", function () {
        it("basic", function () {
            const tags = [
                '/',
                '/foo',
                '/foo/bar'
            ].map(current => Tags_1.Tags.create(current))
                .map(current => {
                const count = 1;
                const members = ['0101'];
                return Object.assign(Object.assign({}, current), { count, members });
            });
            Assertions_1.assertJSON(TagNodes_1.TagNodes.createFoldersRoot({ tags, type: 'folder' }), {
                "children": [
                    {
                        "children": [
                            {
                                "children": [],
                                "count": 1,
                                "id": "/foo/bar",
                                "name": "bar",
                                "path": "/foo/bar",
                                "value": {
                                    "count": 1,
                                    "id": "/foo/bar",
                                    "label": "/foo/bar",
                                    "members": [
                                        "0101"
                                    ]
                                }
                            }
                        ],
                        "count": 1,
                        "id": "/foo",
                        "name": "foo",
                        "path": "/foo",
                        "value": {
                            "count": 1,
                            "id": "/foo",
                            "label": "/foo",
                            "members": [
                                "0101"
                            ]
                        }
                    }
                ],
                "count": 1,
                "id": "/",
                "name": "/",
                "path": "/",
                "value": {
                    "count": 1,
                    "id": "/",
                    "label": "/",
                    "members": [
                        "0101"
                    ]
                }
            });
        });
        it("broken id on parent folder", function () {
            const tags = [
                '/career/compsci',
            ].map(current => Tags_1.Tags.create(current))
                .map(current => {
                const count = 1;
                const members = ['0101'];
                return Object.assign(Object.assign({}, current), { count, members });
            });
            Assertions_1.assertJSON(TagNodes_1.TagNodes.createFoldersRoot({ tags, type: 'folder' }), {
                "children": [
                    {
                        "children": [
                            {
                                "children": [],
                                "count": 1,
                                "id": "/career/compsci",
                                "name": "compsci",
                                "path": "/career/compsci",
                                "value": {
                                    "count": 1,
                                    "id": "/career/compsci",
                                    "label": "/career/compsci",
                                    "members": [
                                        "0101"
                                    ]
                                }
                            }
                        ],
                        "count": 0,
                        "id": "/career",
                        "name": "career",
                        "path": "/career",
                        "value": {
                            "count": 0,
                            "id": "/career",
                            "label": "/career",
                            "members": []
                        }
                    }
                ],
                "count": 1,
                "id": "/",
                "name": "/",
                "path": "/",
                "value": {
                    "count": 1,
                    "id": "/",
                    "label": "/",
                    "members": [
                        "0101"
                    ]
                }
            });
        });
        it("empty", function () {
            Assertions_1.assertJSON(TagNodes_1.TagNodes.createFoldersRoot({ tags: [], type: 'folder' }), {
                "children": [],
                "count": 0,
                "id": "/",
                "name": "/",
                "path": "/",
                "value": {
                    "count": 0,
                    "id": "/",
                    "label": "/",
                    "members": []
                }
            });
        });
    });
});
//# sourceMappingURL=TagNodeTest.js.map