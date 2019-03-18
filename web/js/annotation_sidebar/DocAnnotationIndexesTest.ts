import {DocAnnotation, DocAnnotationMap} from './DocAnnotation';
import {AnnotationType} from '../metadata/AnnotationType';
import {Arrays} from '../util/Arrays';
import {DocAnnotationIndexes} from './DocAnnotationIndexes';
import {DocAnnotationIndex} from './DocAnnotationIndex';
import {assertJSON} from '../test/Assertions';
import {TextHighlights} from '../metadata/TextHighlights';
import {TestingTime} from '../test/TestingTime';

describe('DocAnnotationIndexes', function() {

    beforeEach(function() {
        TestingTime.freeze();
    });

    it("Basic sorting", function() {

        const a0: DocAnnotation = createAnnotation('0001', 1, 0, 0 );
        const a1: DocAnnotation = createAnnotation('0002', 1, 0, 0 );
        const a2: DocAnnotation = createAnnotation('0003', 1, 0, 0 );

        const docAnnotationMap = createDocAnnotationMap(a0, a1);

        const docAnnotationIndex = new DocAnnotationIndex(docAnnotationMap,
                                                          Object.values(docAnnotationMap));

        const rebuiltDocAnnotationIndex = DocAnnotationIndexes.rebuild(docAnnotationIndex, a2);

        const expected: any = {
            "annotationType": "TEXT_HIGHLIGHT",
            "children": [],
            "comments": [],
            "created": "2009-06-15T13:45:30",
            "id": "0001",
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
            "pageNum": 1,
            "position": {
                "x": 0,
                "y": 0
            }
        };

        const result = Arrays.first(rebuiltDocAnnotationIndex.sortedDocAnnotation)!;
        assertJSON(result, expected);

    });

    it("complex sorting", function() {

        const a0: DocAnnotation = createAnnotation('0001', 3, 0, 100 );
        const a1: DocAnnotation = createAnnotation('0002', 2, 100, 0 );
        const a2: DocAnnotation = createAnnotation('0003', 1, 25, 50);

        const docAnnotationMap = createDocAnnotationMap(a0, a1);

        const docAnnotationIndex = new DocAnnotationIndex(docAnnotationMap,
                                                          Object.values(docAnnotationMap));

        const rebuiltDocAnnotationIndex = DocAnnotationIndexes.rebuild(docAnnotationIndex, a2);

        const expected: any = [
            {
                "id": "0003",
                "annotationType": "TEXT_HIGHLIGHT",
                "pageNum": 1,
                "position": {
                    "x": 25,
                    "y": 50
                },
                "created": "2009-06-15T13:45:30",
                "pageMeta": null,
                "children": [],
                "comments": [],
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
                "id": "0002",
                "annotationType": "TEXT_HIGHLIGHT",
                "pageNum": 2,
                "position": {
                    "x": 100,
                    "y": 0
                },
                "created": "2009-06-15T13:45:30",
                "pageMeta": null,
                "children": [],
                "comments": [],
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
                "id": "0001",
                "annotationType": "TEXT_HIGHLIGHT",
                "pageNum": 3,
                "position": {
                    "x": 0,
                    "y": 100
                },
                "created": "2009-06-15T13:45:30",
                "pageMeta": null,
                "children": [],
                "comments": [],
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

        assertJSON(rebuiltDocAnnotationIndex.sortedDocAnnotation, expected);

    });


});

function createAnnotation(id: string,
                          pageNum: number,
                          x: number,
                          y: number): DocAnnotation {

    const textHighlight = TextHighlights.createMockTextHighlight();

    return {
        id,
        annotationType: AnnotationType.TEXT_HIGHLIGHT,
        pageNum,
        position: {
            x,
            y
        },
        created: '2009-06-15T13:45:30',
        pageMeta: null!,
        children: [],
        comments: [],
        original: textHighlight
    };

}

function createDocAnnotationMap(...docAnnotations: DocAnnotation[]): DocAnnotationMap {

    const result: DocAnnotationMap = {};

    docAnnotations = Arrays.shuffle(...docAnnotations);

    for (const docAnnotation of docAnnotations) {
        result[docAnnotation.id] = docAnnotation;
    }

    return result;

}
