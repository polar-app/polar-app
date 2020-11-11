"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DataObjectIndex_1 = require("./DataObjectIndex");
const Tags_1 = require("polar-shared/src/tags/Tags");
const Assertions_1 = require("../../../../web/js/test/Assertions");
describe('DataObjectIndex', function () {
    it("basic", function () {
        const index = new DataObjectIndex_1.DataObjectIndex((p) => p.tags);
        index.put('alice', { name: 'alice', tags: [Tags_1.Tags.create('nice'), Tags_1.Tags.create('happy')] });
        index.put('bob', { name: 'bob', tags: [Tags_1.Tags.create('mean'), Tags_1.Tags.create('bad')] });
        Assertions_1.assertJSON(index.values(), [
            {
                "name": "alice",
                "tags": [
                    {
                        "id": "nice",
                        "label": "nice"
                    },
                    {
                        "id": "happy",
                        "label": "happy"
                    }
                ]
            },
            {
                "name": "bob",
                "tags": [
                    {
                        "id": "mean",
                        "label": "mean"
                    },
                    {
                        "id": "bad",
                        "label": "bad"
                    }
                ]
            }
        ]);
        Assertions_1.assertJSON(index.toTagDescriptors(), [
            {
                "id": "nice",
                "label": "nice",
                "count": 1,
                "members": [
                    "alice"
                ]
            },
            {
                "id": "happy",
                "label": "happy",
                "count": 1,
                "members": [
                    "alice"
                ]
            },
            {
                "id": "mean",
                "label": "mean",
                "count": 1,
                "members": [
                    "bob"
                ]
            },
            {
                "id": "bad",
                "label": "bad",
                "count": 1,
                "members": [
                    "bob"
                ]
            }
        ]);
        index.delete('bob');
        Assertions_1.assertJSON(index.toTagDescriptors(), [
            {
                "id": "nice",
                "label": "nice",
                "count": 1,
                "members": [
                    "alice"
                ]
            },
            {
                "id": "happy",
                "label": "happy",
                "count": 1,
                "members": [
                    "alice"
                ]
            }
        ]);
    });
    it("tag add and remove", function () {
        const index = new DataObjectIndex_1.DataObjectIndex((p) => p.tags);
        const cat = Tags_1.Tags.create("cat");
        const dog = Tags_1.Tags.create("dog");
        index.put('alice', { name: 'alice', tags: [] });
        Assertions_1.assertJSON(index.toTagDescriptors(), []);
        index.put('alice', { name: 'alice', tags: [cat] });
        Assertions_1.assertJSON(index.toTagDescriptors(), [
            {
                "id": "cat",
                "label": "cat",
                "count": 1,
                "members": [
                    "alice"
                ]
            }
        ]);
        index.put('alice', { name: 'alice', tags: [] });
        Assertions_1.assertJSON(index.toTagDescriptors(), [
            {
                "id": "cat",
                "label": "cat",
                "count": 0,
                "members": []
            }
        ]);
    });
});
//# sourceMappingURL=DataObjectIndexTest.js.map