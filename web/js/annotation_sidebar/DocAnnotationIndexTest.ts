import {IDocAnnotation} from './DocAnnotation';
import {AnnotationType} from '../metadata/AnnotationType';
import {DocAnnotationIndex} from './DocAnnotationIndex';
import {assert} from 'chai';
import {assertJSON} from '../test/Assertions';
import {TextHighlights} from '../metadata/TextHighlights';
import {TestingTime} from '../test/TestingTime';
import {ObjectIDs} from '../util/ObjectIDs';
import {Ref} from "../metadata/Refs";

function toDocAnnotations(docAnnotationIndex: DocAnnotationIndex) {
    return docAnnotationIndex.getDocAnnotationsSorted().map(current => current.obj);
}

describe('DocAnnotationIndex', function() {

    beforeEach(function() {
        TestingTime.freeze();
    });



    it("Basic sorting", function() {

        const a0 = createAnnotation('0001', 1, 0, 0 );
        const a1 = createAnnotation('0002', 1, 0, 0 );
        const a2 = createAnnotation('0003', 1, 0, 0 );

        const docAnnotationIndex = new DocAnnotationIndex();
        docAnnotationIndex.put(a0, a1, a2);

        // const rebuiltDocAnnotationIndex = DocAnnotationIndexes.rebuild(docAnnotationIndex, a2);

        const expected: any = {
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

        // const result = Arrays.first(docAnnotationIndex.getDocAnnotations())!;

        const docAnnotations = toDocAnnotations(docAnnotationIndex);

        // assertJSON(Dictionaries.sorted(result), Dictionaries.sorted(expected));
        assertJSON(docAnnotations, [
            {
                "oid": 0,
                "id": "0001",
                "annotationType": "TEXT_HIGHLIGHT",
                "pageNum": 1,
                "position": {
                    "x": 0,
                    "y": 0
                },
                "created": "2009-06-15T13:45:30",
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
                }
            },
            {
                "oid": 1,
                "id": "0002",
                "annotationType": "TEXT_HIGHLIGHT",
                "pageNum": 1,
                "position": {
                    "x": 0,
                    "y": 0
                },
                "created": "2009-06-15T13:45:30",
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
                }
            },
            {
                "oid": 2,
                "id": "0003",
                "annotationType": "TEXT_HIGHLIGHT",
                "pageNum": 1,
                "position": {
                    "x": 0,
                    "y": 0
                },
                "created": "2009-06-15T13:45:30",
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
                }
            }
        ]);

    });

    it("complex sorting", function() {

        const a0 = createAnnotation('0001', 3, 0, 100 );
        const a1 = createAnnotation('0002', 2, 100, 0 );
        const a2 = createAnnotation('0003', 1, 25, 50);

        const docAnnotationIndex = new DocAnnotationIndex();
        docAnnotationIndex.put(a0, a1, a2);

        const expected: any = [
            {
                "oid": 5,
                "id": "0003",
                "annotationType": "TEXT_HIGHLIGHT",
                "pageNum": 1,
                "position": {
                    "x": 25,
                    "y": 50
                },
                "created": "2009-06-15T13:45:30",
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
                }
            },
            {
                "oid": 4,
                "id": "0002",
                "annotationType": "TEXT_HIGHLIGHT",
                "pageNum": 2,
                "position": {
                    "x": 100,
                    "y": 0
                },
                "created": "2009-06-15T13:45:30",
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
                }
            },
            {
                "oid": 3,
                "id": "0001",
                "annotationType": "TEXT_HIGHLIGHT",
                "pageNum": 3,
                "position": {
                    "x": 0,
                    "y": 100
                },
                "created": "2009-06-15T13:45:30",
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
                }
            }
        ];

        const docAnnotations = toDocAnnotations(docAnnotationIndex);

        assertJSON(docAnnotations, expected);

    });

    it("Parent and child and delete child", function() {

        const a0 = createAnnotation('text-area:1', 1, 0, 0 );
        const a1 = createAnnotation('comment:1', 1, 0, 0, 'text-area:1');

        const docAnnotationIndex = new DocAnnotationIndex();
        docAnnotationIndex.put(a0, a1);

        assertJSON(docAnnotationIndex.getDocAnnotations().map(current => current.id), [
            "text-area:1",
            "comment:1"
        ]);

        const children = docAnnotationIndex.get('text-area:1')!.getChildren();
        assertJSON(children.length, 1);

        assert.equal(children[0].id, "comment:1");

        docAnnotationIndex.delete("comment:1");

        assertJSON(docAnnotationIndex.get('text-area:1')!.getChildren().length, 0);

    });


    it("Parent and child and delete parent", function() {

        const a0 = createAnnotation('text-area:1', 1, 0, 0 );
        const a1 = createAnnotation('comment:1', 1, 0, 0, 'text-area:1');

        const docAnnotationIndex = new DocAnnotationIndex();
        docAnnotationIndex.put(a0, a1);

        docAnnotationIndex.delete("text-area:1");

        assert.isUndefined(docAnnotationIndex.get('text-area:1'));

    });
    //
    // it("testScore", function() {
    //
    //     const d0: DocAnnotation = <DocAnnotation> <any> BROKEN[0];
    //     const d1: DocAnnotation = <DocAnnotation> <any> BROKEN[1];
    //     // const d1: DocAnnotation = BROKEN[1];
    //
    //     const dump = (docAnnotation: DocAnnotation) => {
    //
    //         console.log("  annotationType: ", docAnnotation.annotationType);
    //         console.log("  position: ", docAnnotation.position);
    //
    //     };
    //
    //     console.log("d0 : ");
    //     dump(d0);
    //
    //     console.log("d1 : ");
    //     dump(d1);
    //
    //     DocAnnotationIndexes.computeScore(d0);
    //     DocAnnotationIndexes.computeScore(d1);
    //
    //
    // });

});

function createAnnotation(id: string,
                          pageNum: number,
                          x: number,
                          y: number,
                          ref?: Ref): IDocAnnotation {

    const textHighlight = TextHighlights.createMockTextHighlight();

    return {
        oid: ObjectIDs.create(),
        id,
        annotationType: AnnotationType.TEXT_HIGHLIGHT,
        pageNum,
        position: {
            x,
            y
        },
        created: '2009-06-15T13:45:30',
        pageMeta: null!,
        docMeta: null!,
        original: textHighlight,
        ref
    };

}
