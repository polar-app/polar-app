import {DocAnnotation, DocAnnotationMap} from './DocAnnotation';
import {AnnotationType} from '../metadata/AnnotationType';
import {Arrays} from '../util/Arrays';
import {DocAnnotationIndexes} from './DocAnnotationIndexes';
import {DocAnnotationIndex} from './DocAnnotationIndex';
import {assertJSON} from '../test/Assertions';
import {TextHighlights} from '../metadata/TextHighlights';
import {TestingTime} from '../test/TestingTime';
import {ObjectIDs} from '../util/ObjectIDs';

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

        const result = Arrays.first(rebuiltDocAnnotationIndex.sortedDocAnnotations)!;
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
                "children": [],
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
                "children": [],
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
                "children": [],
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

        assertJSON(rebuiltDocAnnotationIndex.sortedDocAnnotations, expected);

    });

    it("testScore", function() {

        const d0: DocAnnotation = <DocAnnotation> <any> BROKEN[0];
        const d1: DocAnnotation = <DocAnnotation> <any> BROKEN[1];
        // const d1: DocAnnotation = BROKEN[1];

        const dump = (docAnnotation: DocAnnotation) => {

            console.log("  annotationType: ", docAnnotation.annotationType);
            console.log("  position: ", docAnnotation.position);

        };

        console.log("d0 : ");
        dump(d0);

        console.log("d1 : ");
        dump(d1);

        DocAnnotationIndexes.computeScore(d0);
        DocAnnotationIndexes.computeScore(d1);


    });

});

function createAnnotation(id: string,
                          pageNum: number,
                          x: number,
                          y: number): DocAnnotation {

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
        children: [],
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

const BROKEN = [
    {
        "id": "12B3cvLGj5",
        "annotationType": "AREA_HIGHLIGHT",
        "image": {
            "id": "12YiPrWBEbHeLKivZqcj",
            "type": "image\/png",
            "src": {
                "backend": "image",
                "name": "12YiPrWBEbHeLKivZqcj.png"
            },
            "width": 147,
            "height": 147,
            "rel": "screenshot"
        },
        "pageNum": 3,
        "position": {
            "x": 10.011123470523,
            "y": 36.216216216216
        },
        "created": "2019-04-28T01:55:57.754Z",
        "pageMeta": {
            "pagemarks": {

            },
            "notes": {

            },
            "comments": {

            },
            "questions": {

            },
            "flashcards": {
                "12UsfLmMKi": {
                    "id": "12UsfLmMKi",
                    "guid": "12UsfLmMKi",
                    "created": "2019-04-25T20:16:48.596Z",
                    "lastUpdated": "2019-04-25T20:16:48.596Z",
                    "type": "BASIC_FRONT_BACK",
                    "fields": {
                        "front": {
                            "HTML": "<p>test<\/p>"
                        },
                        "back": {
                            "HTML": "<p>test<\/p>"
                        }
                    },
                    "archetype": "9d146db1-7c31-4bcf-866b-7b485c4e50ea",
                    "ref": "text-highlight:18huyZe1tb"
                }
            },
            "textHighlights": {
                "1r739BTwaJ": {
                    "id": "1r739BTwaJ",
                    "guid": "1r739BTwaJ",
                    "created": "2019-04-28T01:56:16.225Z",
                    "lastUpdated": "2019-04-28T01:56:16.225Z",
                    "rects": {
                        "0": {
                            "left": 72,
                            "top": 293.6,
                            "right": 342.0353352,
                            "bottom": 309.6,
                            "width": 270.0353352,
                            "height": 16
                        }
                    },
                    "textSelections": {
                        "0": {
                            "text": "Mark D. Hill, ",
                            "rect": {
                                "left": 72,
                                "top": 293.6,
                                "right": 156.3667176,
                                "bottom": 309.6,
                                "width": 84.3667176,
                                "height": 16
                            }
                        },
                        "1": {
                            "text": "University of Wisconsin, Madison",
                            "rect": {
                                "left": 156,
                                "top": 293.6,
                                "right": 342.0353352,
                                "bottom": 309.6,
                                "width": 186.0353352,
                                "height": 16
                            }
                        }
                    },
                    "text": {
                        "TEXT": "Mark D. Hill, \nUniversity of Wisconsin, Madison"
                    },
                    "images": {

                    },
                    "notes": {

                    },
                    "questions": {

                    },
                    "flashcards": {

                    },
                    "color": "red"
                }
            },
            "areaHighlights": {
                "12B3cvLGj5": {
                    "id": "12B3cvLGj5",
                    "created": "2019-04-28T01:55:57.754Z",
                    "lastUpdated": "2019-04-28T01:58:21.277Z",
                    "rects": {
                        "0": {
                            "left": 10.011123470523,
                            "top": 36.216216216216,
                            "width": 16.351501668521,
                            "height": 13.243243243243
                        }
                    },
                    "notes": {

                    },
                    "questions": {

                    },
                    "flashcards": {

                    },
                    "images": {

                    },
                    "image": {
                        "id": "12YiPrWBEbHeLKivZqcj",
                        "type": "image\/png",
                        "src": {
                            "backend": "image",
                            "name": "12YiPrWBEbHeLKivZqcj.png"
                        },
                        "width": 147,
                        "height": 147,
                        "rel": "screenshot"
                    }
                }
            },
            "screenshots": {

            },
            "thumbnails": {

            },
            "readingProgress": {
                "12qXQkFkj2": {
                    "id": "12qXQkFkj2",
                    "created": "2019-04-25T20:16:23.392Z",
                    "progress": 0,
                    "progressByMode": {

                    }
                },
                "1LGz1P5CwM": {
                    "id": "1LGz1P5CwM",
                    "created": "2019-04-25T20:16:23.419Z",
                    "progress": 12.65,
                    "progressByMode": {
                        "READ": 12.65
                    }
                }
            },
            "pageInfo": {
                "num": 3
            }
        },
        "children": [

        ],
        "comments": [

        ],
        "original": {
            "id": "12B3cvLGj5",
            "created": "2019-04-28T01:55:57.754Z",
            "lastUpdated": "2019-04-28T01:58:21.277Z",
            "rects": {
                "0": {
                    "left": 10.011123470523,
                    "top": 36.216216216216,
                    "width": 16.351501668521,
                    "height": 13.243243243243
                }
            },
            "notes": {

            },
            "questions": {

            },
            "flashcards": {

            },
            "images": {

            },
            "image": {
                "id": "12YiPrWBEbHeLKivZqcj",
                "type": "image\/png",
                "src": {
                    "backend": "image",
                    "name": "12YiPrWBEbHeLKivZqcj.png"
                },
                "width": 147,
                "height": 147,
                "rel": "screenshot"
            }
        }
    },
    {
        "id": "1r739BTwaJ",
        "annotationType": "TEXT_HIGHLIGHT",
        "html": "Mark D. Hill, \nUniversity of Wisconsin, Madison",
        "pageNum": 3,
        "position": {
            "x": 72,
            "y": 293.6
        },
        "color": "red",
        "created": "2019-04-28T01:56:16.225Z",
        "pageMeta": {
            "pagemarks": {

            },
            "notes": {

            },
            "comments": {

            },
            "questions": {

            },
            "flashcards": {
                "12UsfLmMKi": {
                    "id": "12UsfLmMKi",
                    "guid": "12UsfLmMKi",
                    "created": "2019-04-25T20:16:48.596Z",
                    "lastUpdated": "2019-04-25T20:16:48.596Z",
                    "type": "BASIC_FRONT_BACK",
                    "fields": {
                        "front": {
                            "HTML": "<p>test<\/p>"
                        },
                        "back": {
                            "HTML": "<p>test<\/p>"
                        }
                    },
                    "archetype": "9d146db1-7c31-4bcf-866b-7b485c4e50ea",
                    "ref": "text-highlight:18huyZe1tb"
                }
            },
            "textHighlights": {
                "1r739BTwaJ": {
                    "id": "1r739BTwaJ",
                    "guid": "1r739BTwaJ",
                    "created": "2019-04-28T01:56:16.225Z",
                    "lastUpdated": "2019-04-28T01:56:16.225Z",
                    "rects": {
                        "0": {
                            "left": 72,
                            "top": 293.6,
                            "right": 342.0353352,
                            "bottom": 309.6,
                            "width": 270.0353352,
                            "height": 16
                        }
                    },
                    "textSelections": {
                        "0": {
                            "text": "Mark D. Hill, ",
                            "rect": {
                                "left": 72,
                                "top": 293.6,
                                "right": 156.3667176,
                                "bottom": 309.6,
                                "width": 84.3667176,
                                "height": 16
                            }
                        },
                        "1": {
                            "text": "University of Wisconsin, Madison",
                            "rect": {
                                "left": 156,
                                "top": 293.6,
                                "right": 342.0353352,
                                "bottom": 309.6,
                                "width": 186.0353352,
                                "height": 16
                            }
                        }
                    },
                    "text": {
                        "TEXT": "Mark D. Hill, \nUniversity of Wisconsin, Madison"
                    },
                    "images": {

                    },
                    "notes": {

                    },
                    "questions": {

                    },
                    "flashcards": {

                    },
                    "color": "red"
                }
            },
            "areaHighlights": {
                "12B3cvLGj5": {
                    "id": "12B3cvLGj5",
                    "created": "2019-04-28T01:55:57.754Z",
                    "lastUpdated": "2019-04-28T01:58:21.277Z",
                    "rects": {
                        "0": {
                            "left": 10.011123470523,
                            "top": 36.216216216216,
                            "width": 16.351501668521,
                            "height": 13.243243243243
                        }
                    },
                    "notes": {

                    },
                    "questions": {

                    },
                    "flashcards": {

                    },
                    "images": {

                    },
                    "image": {
                        "id": "12YiPrWBEbHeLKivZqcj",
                        "type": "image\/png",
                        "src": {
                            "backend": "image",
                            "name": "12YiPrWBEbHeLKivZqcj.png"
                        },
                        "width": 147,
                        "height": 147,
                        "rel": "screenshot"
                    }
                }
            },
            "screenshots": {

            },
            "thumbnails": {

            },
            "readingProgress": {
                "12qXQkFkj2": {
                    "id": "12qXQkFkj2",
                    "created": "2019-04-25T20:16:23.392Z",
                    "progress": 0,
                    "progressByMode": {

                    }
                },
                "1LGz1P5CwM": {
                    "id": "1LGz1P5CwM",
                    "created": "2019-04-25T20:16:23.419Z",
                    "progress": 12.65,
                    "progressByMode": {
                        "READ": 12.65
                    }
                }
            },
            "pageInfo": {
                "num": 3
            }
        },
        "children": [

        ],
        "comments": [

        ],
        "original": {
            "id": "1r739BTwaJ",
            "guid": "1r739BTwaJ",
            "created": "2019-04-28T01:56:16.225Z",
            "lastUpdated": "2019-04-28T01:56:16.225Z",
            "rects": {
                "0": {
                    "left": 72,
                    "top": 293.6,
                    "right": 342.0353352,
                    "bottom": 309.6,
                    "width": 270.0353352,
                    "height": 16
                }
            },
            "textSelections": {
                "0": {
                    "text": "Mark D. Hill, ",
                    "rect": {
                        "left": 72,
                        "top": 293.6,
                        "right": 156.3667176,
                        "bottom": 309.6,
                        "width": 84.3667176,
                        "height": 16
                    }
                },
                "1": {
                    "text": "University of Wisconsin, Madison",
                    "rect": {
                        "left": 156,
                        "top": 293.6,
                        "right": 342.0353352,
                        "bottom": 309.6,
                        "width": 186.0353352,
                        "height": 16
                    }
                }
            },
            "text": {
                "TEXT": "Mark D. Hill, \nUniversity of Wisconsin, Madison"
            },
            "images": {

            },
            "notes": {

            },
            "questions": {

            },
            "flashcards": {

            },
            "color": "red"
        }
    }
];
