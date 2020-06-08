import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {PagemarkType} from "polar-shared/src/metadata/PagemarkType";
import {Backend} from "polar-shared/src/datastore/Backend";
import {PagemarkMode} from "polar-shared/src/metadata/PagemarkMode";

export class MockIDocMetas {

    public static create(): IDocMeta {

        return {
            "annotationInfo": {},
            "version": 2,
            "attachments": {},
            "docInfo": {
                "progress": 2,
                "pagemarkType": PagemarkType.SINGLE_COLUMN,
                "properties": {},
                "archived": false,
                "flagged": false,
                "tags": {},
                "attachments": {
                    "1fgJWGXVQGMekJe2zxRc": {
                        "fileRef": {
                            "backend": Backend.IMAGE,
                            "name": "1fgJWGXVQGMekJe2zxRc.png"
                        }
                    }
                },
                "nrPages": 1,
                "fingerprint": "1eo77FKGRjjCLQ3PejGw",
                "added": "2019-08-20T20:07:49.283Z",
                "filename": "1aYMbsa64k-How_neural_networks_are_trained.phz",
                "uuid": "z2019-08-22T23:54:22.782Z+000013-571695052427",
                "title": "How neural networks are trained",
                "url": "https://ml4a.github.io/ml4a/how_neural_networks_are_trained/",
                "readingPerDay": {
                    "2019-08-20": 0.75
                },
                "lastUpdated": "2019-08-22T23:54:22.782Z",
                "nrComments": 0,
                "nrNotes": 0,
                "nrFlashcards": 0,
                "nrTextHighlights": 0,
                "nrAreaHighlights": 1,
                "nrAnnotations": 1
            },
            "pageMetas": {
                1: {
                    "pagemarks": {
                        "12PsPXnWtt": {
                            "id": "12PsPXnWtt",
                            "guid": "12PsPXnWtt",
                            "created": "2019-08-20T20:07:52.255Z",
                            "lastUpdated": "2019-08-20T20:07:52.255Z",
                            "type": PagemarkType.SINGLE_COLUMN,
                            "percentage": 2.450475208977442,
                            "column": 0,
                            "rect": {
                                "left": 0,
                                "top": 0,
                                "width": 100,
                                "height": 2.450475208977442
                            },
                            "batch": "12QFkgvSCz",
                            "mode": PagemarkMode.READ,
                            "notes": {}
                        }
                    },
                    "notes": {},
                    "comments": {},
                    "questions": {},
                    "flashcards": {},
                    "textHighlights": {},
                    "areaHighlights": {
                    },
                    "screenshots": {},
                    "thumbnails": {},
                    "readingProgress": {
                        "1274LC71uu": {
                            "id": "1274LC71uu",
                            "created": "2019-08-20T20:07:52.252Z",
                            "progress": 0,
                            "progressByMode": {}
                        },
                        "12J6HBUqRb": {
                            "id": "12J6HBUqRb",
                            "created": "2019-08-20T20:07:52.266Z",
                            "progress": 1.3683728387,
                            "progressByMode": {
                                "READ": 1.3683728387
                            }
                        },
                        "1VuQMT2PdD": {
                            "id": "1VuQMT2PdD",
                            "created": "2019-08-20T20:07:53.691Z",
                            "progress": 1.4342150463758159,
                            "progressByMode": {
                                "READ": 1.4342150463758159
                            }
                        },
                        "1Nciwzs5UA": {
                            "id": "1Nciwzs5UA",
                            "created": "2019-08-20T20:08:30.470Z",
                            "progress": 2.450475208977442,
                            "progressByMode": {
                                "READ": 2.450475208977442
                            }
                        }
                    },
                    "pageInfo": {
                        "num": 1,
                        "dimensions": {
                            "width": 750,
                            "height": 33670
                        }
                    }
                }
            }
        };

    }

    public static createWithAreaHighlight(): IDocMeta {

        return {
            "annotationInfo": {},
            "version": 2,
            "attachments": {},
            "docInfo": {
                "progress": 2,
                "pagemarkType": PagemarkType.SINGLE_COLUMN,
                "properties": {},
                "archived": false,
                "flagged": false,
                "tags": {},
                "attachments": {
                    "1fgJWGXVQGMekJe2zxRc": {
                        "fileRef": {
                            "backend": Backend.IMAGE,
                            "name": "1fgJWGXVQGMekJe2zxRc.png"
                        }
                    }
                },
                "nrPages": 1,
                "fingerprint": "1eo77FKGRjjCLQ3PejGw",
                "added": "2019-08-20T20:07:49.283Z",
                "filename": "1aYMbsa64k-How_neural_networks_are_trained.phz",
                "uuid": "z2019-08-22T23:54:22.782Z+000013-571695052427",
                "title": "How neural networks are trained",
                "url": "https://ml4a.github.io/ml4a/how_neural_networks_are_trained/",
                "readingPerDay": {
                    "2019-08-20": 0.75
                },
                "lastUpdated": "2019-08-22T23:54:22.782Z",
                "nrComments": 0,
                "nrNotes": 0,
                "nrFlashcards": 0,
                "nrTextHighlights": 0,
                "nrAreaHighlights": 1,
                "nrAnnotations": 1
            },
            "pageMetas": {
                1: {
                    "pagemarks": {
                        "12PsPXnWtt": {
                            "id": "12PsPXnWtt",
                            "guid": "12PsPXnWtt",
                            "created": "2019-08-20T20:07:52.255Z",
                            "lastUpdated": "2019-08-20T20:07:52.255Z",
                            "type": PagemarkType.SINGLE_COLUMN,
                            "percentage": 2.450475208977442,
                            "column": 0,
                            "rect": {
                                "left": 0,
                                "top": 0,
                                "width": 100,
                                "height": 2.450475208977442
                            },
                            "batch": "12QFkgvSCz",
                            "mode": PagemarkMode.READ,
                            "notes": {}
                        }
                    },
                    "notes": {},
                    "comments": {},
                    "questions": {},
                    "flashcards": {},
                    "textHighlights": {},
                    "areaHighlights": {
                        "1LeRjw4tGY": {
                            "id": "1LeRjw4tGY",
                            "guid": "1LeRjw4tGY",
                            "created": "2019-08-22T23:54:17.849Z",
                            "lastUpdated": "2019-08-22T23:54:22.721Z",
                            "rects": {
                                "0": {
                                    "left": 15.866666666666667,
                                    "top": 2.510592007328524,
                                    "width": 67.6,
                                    "height": 1.0019466391847018,
                                    "bottom": 100,
                                    "right": 100
                                }
                            },
                            "notes": {},
                            "questions": {},
                            "flashcards": {},
                            "images": {},
                            "image": {
                                "id": "1fgJWGXVQGMekJe2zxRc",
                                "type": "image/png",
                                "src": {
                                    "backend": Backend.IMAGE,
                                    "name": "1fgJWGXVQGMekJe2zxRc.png"
                                },
                                "width": 507,
                                "height": 350,
                                "rel": "screenshot"
                            },
                            "position": {
                                "x": 119.00000000000001,
                                "y": 877,
                                "width": 506.99999999999994,
                                "height": 350
                            }
                        }
                    },
                    "screenshots": {},
                    "thumbnails": {},
                    "readingProgress": {
                        "1274LC71uu": {
                            "id": "1274LC71uu",
                            "created": "2019-08-20T20:07:52.252Z",
                            "progress": 0,
                            "progressByMode": {}
                        },
                        "12J6HBUqRb": {
                            "id": "12J6HBUqRb",
                            "created": "2019-08-20T20:07:52.266Z",
                            "progress": 1.3683728387,
                            "progressByMode": {
                                "READ": 1.3683728387
                            }
                        },
                        "1VuQMT2PdD": {
                            "id": "1VuQMT2PdD",
                            "created": "2019-08-20T20:07:53.691Z",
                            "progress": 1.4342150463758159,
                            "progressByMode": {
                                "READ": 1.4342150463758159
                            }
                        },
                        "1Nciwzs5UA": {
                            "id": "1Nciwzs5UA",
                            "created": "2019-08-20T20:08:30.470Z",
                            "progress": 2.450475208977442,
                            "progressByMode": {
                                "READ": 2.450475208977442
                            }
                        }
                    },
                    "pageInfo": {
                        "num": 1,
                        "dimensions": {
                            "width": 750,
                            "height": 33670
                        }
                    }
                }
            }
        };

    }

    public static createWithTwoAreaHighlights(): IDocMeta {

        return {
            "annotationInfo": {},
            "version": 2,
            "attachments": {},
            "docInfo": {
                "progress": 2,
                "pagemarkType": PagemarkType.SINGLE_COLUMN,
                "properties": {},
                "archived": false,
                "flagged": false,
                "tags": {},
                "attachments": {
                    "1fgJWGXVQGMekJe2zxRc": {
                        "fileRef": {
                            "backend": Backend.IMAGE,
                            "name": "1fgJWGXVQGMekJe2zxRc.png"
                        }
                    }
                },
                "nrPages": 1,
                "fingerprint": "1eo77FKGRjjCLQ3PejGw",
                "added": "2019-08-20T20:07:49.283Z",
                "filename": "1aYMbsa64k-How_neural_networks_are_trained.phz",
                "uuid": "z2019-08-22T23:54:22.782Z+000013-571695052427",
                "title": "How neural networks are trained",
                "url": "https://ml4a.github.io/ml4a/how_neural_networks_are_trained/",
                "readingPerDay": {
                    "2019-08-20": 0.75
                },
                "lastUpdated": "2019-08-22T23:54:22.782Z",
                "nrComments": 0,
                "nrNotes": 0,
                "nrFlashcards": 0,
                "nrTextHighlights": 0,
                "nrAreaHighlights": 1,
                "nrAnnotations": 1
            },
            "pageMetas": {
                1: {
                    "pagemarks": {
                        "12PsPXnWtt": {
                            "id": "12PsPXnWtt",
                            "guid": "12PsPXnWtt",
                            "created": "2019-08-20T20:07:52.255Z",
                            "lastUpdated": "2019-08-20T20:07:52.255Z",
                            "type": PagemarkType.SINGLE_COLUMN,
                            "percentage": 2.450475208977442,
                            "column": 0,
                            "rect": {
                                "left": 0,
                                "top": 0,
                                "width": 100,
                                "height": 2.450475208977442
                            },
                            "batch": "12QFkgvSCz",
                            "mode": PagemarkMode.READ,
                            "notes": {}
                        }
                    },
                    "notes": {},
                    "comments": {},
                    "questions": {},
                    "flashcards": {},
                    "textHighlights": {},
                    "areaHighlights": {
                        "1LeRjw4tGY": {
                            "id": "1LeRjw4tGY",
                            "guid": "1LeRjw4tGY",
                            "created": "2019-08-22T23:54:17.849Z",
                            "lastUpdated": "2019-08-22T23:54:22.721Z",
                            "rects": {
                                "0": {
                                    "left": 15.866666666666667,
                                    "top": 2.510592007328524,
                                    "width": 67.6,
                                    "height": 1.0019466391847018,
                                    "bottom": 100,
                                    "right": 100
                                }
                            },
                            "notes": {},
                            "questions": {},
                            "flashcards": {},
                            "images": {},
                            "image": {
                                "id": "1fgJWGXVQGMekJe2zxRc",
                                "type": "image/png",
                                "src": {
                                    "backend": Backend.IMAGE,
                                    "name": "1fgJWGXVQGMekJe2zxRc.png"
                                },
                                "width": 507,
                                "height": 350,
                                "rel": "screenshot"
                            },
                            "position": {
                                "x": 119.00000000000001,
                                "y": 877,
                                "width": 506.99999999999994,
                                "height": 350
                            }
                        },
                        "1111LeRjw4tGY": {
                            "id": "1111LeRjw4tGY",
                            "guid": "1111LeRjw4tGY",
                            "created": "2019-08-22T23:54:17.849Z",
                            "lastUpdated": "2019-08-22T23:54:22.721Z",
                            "rects": {
                                "0": {
                                    "left": 15.866666666666667,
                                    "top": 2.510592007328524,
                                    "width": 67.6,
                                    "height": 1.0019466391847018,
                                    "bottom": 100,
                                    "right": 100
                                }
                            },
                            "notes": {},
                            "questions": {},
                            "flashcards": {},
                            "images": {},
                            "image": {
                                "id": "1fgJWGXVQGMekJe2zxRc",
                                "type": "image/png",
                                "src": {
                                    "backend": Backend.IMAGE,
                                    "name": "1fgJWGXVQGMekJe2zxRc.png"
                                },
                                "width": 507,
                                "height": 350,
                                "rel": "screenshot"
                            },
                            "position": {
                                "x": 119.00000000000001,
                                "y": 877,
                                "width": 506.99999999999994,
                                "height": 350
                            }
                        }
                    },
                    "screenshots": {},
                    "thumbnails": {},
                    "readingProgress": {
                        "1274LC71uu": {
                            "id": "1274LC71uu",
                            "created": "2019-08-20T20:07:52.252Z",
                            "progress": 0,
                            "progressByMode": {}
                        },
                        "12J6HBUqRb": {
                            "id": "12J6HBUqRb",
                            "created": "2019-08-20T20:07:52.266Z",
                            "progress": 1.3683728387,
                            "progressByMode": {
                                "READ": 1.3683728387
                            }
                        },
                        "1VuQMT2PdD": {
                            "id": "1VuQMT2PdD",
                            "created": "2019-08-20T20:07:53.691Z",
                            "progress": 1.4342150463758159,
                            "progressByMode": {
                                "READ": 1.4342150463758159
                            }
                        },
                        "1Nciwzs5UA": {
                            "id": "1Nciwzs5UA",
                            "created": "2019-08-20T20:08:30.470Z",
                            "progress": 2.450475208977442,
                            "progressByMode": {
                                "READ": 2.450475208977442
                            }
                        }
                    },
                    "pageInfo": {
                        "num": 1,
                        "dimensions": {
                            "width": 750,
                            "height": 33670
                        }
                    }
                }
            }
        };

    }
}
