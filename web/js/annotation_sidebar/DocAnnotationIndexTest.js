"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const AnnotationType_1 = require("polar-shared/src/metadata/AnnotationType");
const DocAnnotationIndex_1 = require("./DocAnnotationIndex");
const chai_1 = require("chai");
const Assertions_1 = require("../test/Assertions");
const TextHighlights_1 = require("../metadata/TextHighlights");
const TestingTime_1 = require("polar-shared/src/test/TestingTime");
const ObjectIDs_1 = require("../util/ObjectIDs");
const Refs_1 = require("polar-shared/src/metadata/Refs");
const DocMetas_1 = require("../metadata/DocMetas");
function toDocAnnotations(docAnnotationIndex) {
    return docAnnotationIndex.getDocAnnotationsSorted().map(current => current.obj);
}
describe('DocAnnotationIndex', function () {
    beforeEach(function () {
        TestingTime_1.TestingTime.freeze();
    });
    it("Basic sorting", function () {
        const a0 = createAnnotation('0001', 1, 0, 0);
        const a1 = createAnnotation('0002', 1, 0, 0);
        const a2 = createAnnotation('0003', 1, 0, 0);
        const docAnnotationIndex = new DocAnnotationIndex_1.DocAnnotationIndex();
        docAnnotationIndex.put(a0, a1, a2);
        const expected = {
            "annotationType": "TEXT_HIGHLIGHT",
            "children": [],
            "created": "2009-06-15T13:45:30",
            "id": "0001",
            "oid": 0,
            "original": {
                "color": "yellow",
                "created": "2012-03-02T11:38:49.321Z",
                "flashcards": {},
                "guid": "12pNUv1Y9S",
                "id": "12pNUv1Y9S",
                "images": {},
                "lastUpdated": "2012-03-02T11:38:49.321Z",
                "notes": {},
                "questions": {},
                "rects": {
                    "0": {
                        "bottom": 200,
                        "height": 100,
                        "left": 100,
                        "right": 200,
                        "top": 100,
                        "width": 100
                    }
                },
                "text": {
                    "TEXT": "hello world"
                },
                "textSelections": {
                    "0": {
                        "rect": null,
                        "text": "hello world"
                    }
                }
            },
            "pageMeta": null,
            "docMeta": null,
            "pageNum": 1,
            "position": {
                "x": 0,
                "y": 0
            }
        };
        const docAnnotations = toDocAnnotations(docAnnotationIndex);
        Assertions_1.assertJSON(docAnnotations, [
            {
                "oid": 0,
                "id": "0001",
                "guid": "0001",
                "fingerprint": "1234",
                "docInfo": {
                    "progress": 75,
                    "pagemarkType": "SINGLE_COLUMN",
                    "properties": {},
                    "archived": false,
                    "flagged": false,
                    "tags": {},
                    "attachments": {},
                    "nrPages": 4,
                    "fingerprint": "1234",
                    "added": "2012-03-02T11:38:49.321Z",
                    "uuid": "xxxx",
                    "readingPerDay": {
                        "2012-03-02": 3
                    }
                },
                "annotationType": "TEXT_HIGHLIGHT",
                "pageNum": 1,
                "position": {
                    "x": 0,
                    "y": 0
                },
                "created": "2009-06-15T13:45:30",
                "lastUpdated": "2009-06-15T13:45:30",
                "pageMeta": null,
                "docMeta": null,
                "original": {
                    "id": "12pNUv1Y9S",
                    "guid": "12pNUv1Y9S",
                    "created": "2012-03-02T11:38:49.321Z",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "rects": {
                        "0": {
                            "top": 100,
                            "left": 100,
                            "right": 200,
                            "bottom": 200,
                            "width": 100,
                            "height": 100
                        }
                    },
                    "textSelections": {
                        "0": {
                            "text": "hello world",
                            "rect": null
                        }
                    },
                    "text": {
                        "TEXT": "hello world"
                    },
                    "images": {},
                    "notes": {},
                    "questions": {},
                    "flashcards": {},
                    "color": "yellow"
                },
                "immutable": false,
                "tags": {},
                "docMetaRef": {
                    "id": "1234"
                }
            },
            {
                "oid": 1,
                "id": "0002",
                "guid": "0002",
                "fingerprint": "1234",
                "docInfo": {
                    "progress": 75,
                    "pagemarkType": "SINGLE_COLUMN",
                    "properties": {},
                    "archived": false,
                    "flagged": false,
                    "tags": {},
                    "attachments": {},
                    "nrPages": 4,
                    "fingerprint": "1234",
                    "added": "2012-03-02T11:38:49.321Z",
                    "uuid": "xxxx",
                    "readingPerDay": {
                        "2012-03-02": 3
                    }
                },
                "annotationType": "TEXT_HIGHLIGHT",
                "pageNum": 1,
                "position": {
                    "x": 0,
                    "y": 0
                },
                "created": "2009-06-15T13:45:30",
                "lastUpdated": "2009-06-15T13:45:30",
                "pageMeta": null,
                "docMeta": null,
                "original": {
                    "id": "12pNUv1Y9S",
                    "guid": "12pNUv1Y9S",
                    "created": "2012-03-02T11:38:49.321Z",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "rects": {
                        "0": {
                            "top": 100,
                            "left": 100,
                            "right": 200,
                            "bottom": 200,
                            "width": 100,
                            "height": 100
                        }
                    },
                    "textSelections": {
                        "0": {
                            "text": "hello world",
                            "rect": null
                        }
                    },
                    "text": {
                        "TEXT": "hello world"
                    },
                    "images": {},
                    "notes": {},
                    "questions": {},
                    "flashcards": {},
                    "color": "yellow"
                },
                "immutable": false,
                "tags": {},
                "docMetaRef": {
                    "id": "1234"
                }
            },
            {
                "oid": 2,
                "id": "0003",
                "guid": "0003",
                "fingerprint": "1234",
                "docInfo": {
                    "progress": 75,
                    "pagemarkType": "SINGLE_COLUMN",
                    "properties": {},
                    "archived": false,
                    "flagged": false,
                    "tags": {},
                    "attachments": {},
                    "nrPages": 4,
                    "fingerprint": "1234",
                    "added": "2012-03-02T11:38:49.321Z",
                    "uuid": "xxxx",
                    "readingPerDay": {
                        "2012-03-02": 3
                    }
                },
                "annotationType": "TEXT_HIGHLIGHT",
                "pageNum": 1,
                "position": {
                    "x": 0,
                    "y": 0
                },
                "created": "2009-06-15T13:45:30",
                "lastUpdated": "2009-06-15T13:45:30",
                "pageMeta": null,
                "docMeta": null,
                "original": {
                    "id": "12pNUv1Y9S",
                    "guid": "12pNUv1Y9S",
                    "created": "2012-03-02T11:38:49.321Z",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "rects": {
                        "0": {
                            "top": 100,
                            "left": 100,
                            "right": 200,
                            "bottom": 200,
                            "width": 100,
                            "height": 100
                        }
                    },
                    "textSelections": {
                        "0": {
                            "text": "hello world",
                            "rect": null
                        }
                    },
                    "text": {
                        "TEXT": "hello world"
                    },
                    "images": {},
                    "notes": {},
                    "questions": {},
                    "flashcards": {},
                    "color": "yellow"
                },
                "immutable": false,
                "tags": {},
                "docMetaRef": {
                    "id": "1234"
                }
            }
        ]);
    });
    it("complex sorting", function () {
        const a0 = createAnnotation('0001', 3, 0, 100);
        const a1 = createAnnotation('0002', 2, 100, 0);
        const a2 = createAnnotation('0003', 1, 25, 50);
        const docAnnotationIndex = new DocAnnotationIndex_1.DocAnnotationIndex();
        docAnnotationIndex.put(a0, a1, a2);
        const expected = [
            {
                "oid": 5,
                "id": "0003",
                "guid": "0003",
                "fingerprint": "1234",
                "docInfo": {
                    "progress": 75,
                    "pagemarkType": "SINGLE_COLUMN",
                    "properties": {},
                    "archived": false,
                    "flagged": false,
                    "tags": {},
                    "attachments": {},
                    "nrPages": 4,
                    "fingerprint": "1234",
                    "added": "2012-03-02T11:38:49.321Z",
                    "uuid": "xxxx",
                    "readingPerDay": {
                        "2012-03-02": 3
                    }
                },
                "annotationType": "TEXT_HIGHLIGHT",
                "pageNum": 1,
                "position": {
                    "x": 25,
                    "y": 50
                },
                "created": "2009-06-15T13:45:30",
                "lastUpdated": "2009-06-15T13:45:30",
                "pageMeta": null,
                "docMeta": null,
                "original": {
                    "id": "12pNUv1Y9S",
                    "guid": "12pNUv1Y9S",
                    "created": "2012-03-02T11:38:49.321Z",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "rects": {
                        "0": {
                            "top": 100,
                            "left": 100,
                            "right": 200,
                            "bottom": 200,
                            "width": 100,
                            "height": 100
                        }
                    },
                    "textSelections": {
                        "0": {
                            "text": "hello world",
                            "rect": null
                        }
                    },
                    "text": {
                        "TEXT": "hello world"
                    },
                    "images": {},
                    "notes": {},
                    "questions": {},
                    "flashcards": {},
                    "color": "yellow"
                },
                "immutable": false,
                "tags": {},
                "docMetaRef": {
                    "id": "1234"
                }
            },
            {
                "oid": 4,
                "id": "0002",
                "guid": "0002",
                "fingerprint": "1234",
                "docInfo": {
                    "progress": 75,
                    "pagemarkType": "SINGLE_COLUMN",
                    "properties": {},
                    "archived": false,
                    "flagged": false,
                    "tags": {},
                    "attachments": {},
                    "nrPages": 4,
                    "fingerprint": "1234",
                    "added": "2012-03-02T11:38:49.321Z",
                    "uuid": "xxxx",
                    "readingPerDay": {
                        "2012-03-02": 3
                    }
                },
                "annotationType": "TEXT_HIGHLIGHT",
                "pageNum": 2,
                "position": {
                    "x": 100,
                    "y": 0
                },
                "created": "2009-06-15T13:45:30",
                "lastUpdated": "2009-06-15T13:45:30",
                "pageMeta": null,
                "docMeta": null,
                "original": {
                    "id": "12pNUv1Y9S",
                    "guid": "12pNUv1Y9S",
                    "created": "2012-03-02T11:38:49.321Z",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "rects": {
                        "0": {
                            "top": 100,
                            "left": 100,
                            "right": 200,
                            "bottom": 200,
                            "width": 100,
                            "height": 100
                        }
                    },
                    "textSelections": {
                        "0": {
                            "text": "hello world",
                            "rect": null
                        }
                    },
                    "text": {
                        "TEXT": "hello world"
                    },
                    "images": {},
                    "notes": {},
                    "questions": {},
                    "flashcards": {},
                    "color": "yellow"
                },
                "immutable": false,
                "tags": {},
                "docMetaRef": {
                    "id": "1234"
                }
            },
            {
                "oid": 3,
                "id": "0001",
                "guid": "0001",
                "fingerprint": "1234",
                "docInfo": {
                    "progress": 75,
                    "pagemarkType": "SINGLE_COLUMN",
                    "properties": {},
                    "archived": false,
                    "flagged": false,
                    "tags": {},
                    "attachments": {},
                    "nrPages": 4,
                    "fingerprint": "1234",
                    "added": "2012-03-02T11:38:49.321Z",
                    "uuid": "xxxx",
                    "readingPerDay": {
                        "2012-03-02": 3
                    }
                },
                "annotationType": "TEXT_HIGHLIGHT",
                "pageNum": 3,
                "position": {
                    "x": 0,
                    "y": 100
                },
                "created": "2009-06-15T13:45:30",
                "lastUpdated": "2009-06-15T13:45:30",
                "pageMeta": null,
                "docMeta": null,
                "original": {
                    "id": "12pNUv1Y9S",
                    "guid": "12pNUv1Y9S",
                    "created": "2012-03-02T11:38:49.321Z",
                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                    "rects": {
                        "0": {
                            "top": 100,
                            "left": 100,
                            "right": 200,
                            "bottom": 200,
                            "width": 100,
                            "height": 100
                        }
                    },
                    "textSelections": {
                        "0": {
                            "text": "hello world",
                            "rect": null
                        }
                    },
                    "text": {
                        "TEXT": "hello world"
                    },
                    "images": {},
                    "notes": {},
                    "questions": {},
                    "flashcards": {},
                    "color": "yellow"
                },
                "immutable": false,
                "tags": {},
                "docMetaRef": {
                    "id": "1234"
                }
            }
        ];
        const docAnnotations = toDocAnnotations(docAnnotationIndex);
        Assertions_1.assertJSON(docAnnotations, expected, "main output wrong (1)");
    });
    it("Parent and child and delete child", function () {
        const a0 = createAnnotation('textarea1', 1, 0, 0);
        const a1 = createAnnotation('comment1', 1, 0, 0, 'text-area:textarea1');
        const docAnnotationIndex = new DocAnnotationIndex_1.DocAnnotationIndex();
        docAnnotationIndex.put(a0, a1);
        Assertions_1.assertJSON(docAnnotationIndex.getDocAnnotations().map(current => current.id), [
            "textarea1",
        ], "textarea1 is wrong");
        const children = docAnnotationIndex.get('textarea1').getChildren();
        chai_1.assert.isDefined(children);
        chai_1.assert.equal(children.length, 1, "children not valid");
        chai_1.assert.equal(children[0].id, "comment1", "comment1 not valid");
        docAnnotationIndex.delete("comment1");
        chai_1.assert.isDefined(docAnnotationIndex.get('textarea1').getChildren());
        Assertions_1.assertJSON(docAnnotationIndex.get('textarea1').getChildren().length, 0);
    });
    it("Parent and child and delete parent", function () {
        const a0 = createAnnotation('text-area:1', 1, 0, 0);
        const a1 = createAnnotation('comment:1', 1, 0, 0, 'text-area:1');
        const docAnnotationIndex = new DocAnnotationIndex_1.DocAnnotationIndex();
        docAnnotationIndex.put(a0, a1);
        docAnnotationIndex.delete("text-area:1");
        chai_1.assert.isUndefined(docAnnotationIndex.get('text-area:1'), "text-area:1 was not undefined");
    });
});
function createAnnotation(id, pageNum, x, y, ref) {
    const textHighlight = TextHighlights_1.TextHighlights.createMockTextHighlight();
    const parent = ref ? Refs_1.Refs.parse(ref) : undefined;
    const fingerprint = '1234';
    const mockDocMeta = DocMetas_1.MockDocMetas.createMockDocMeta(fingerprint);
    const docInfo = mockDocMeta.docInfo;
    docInfo.uuid = 'xxxx';
    return {
        oid: ObjectIDs_1.ObjectIDs.create(),
        id,
        guid: id,
        fingerprint,
        docInfo,
        text: undefined,
        html: undefined,
        annotationType: AnnotationType_1.AnnotationType.TEXT_HIGHLIGHT,
        pageNum,
        position: {
            x,
            y
        },
        created: '2009-06-15T13:45:30',
        lastUpdated: '2009-06-15T13:45:30',
        pageMeta: null,
        docMeta: null,
        original: textHighlight,
        ref,
        immutable: false,
        color: undefined,
        img: undefined,
        tags: {},
        children: () => [],
        parent,
        docMetaRef: {
            id: '1234'
        },
        order: undefined
    };
}
//# sourceMappingURL=DocAnnotationIndexTest.js.map