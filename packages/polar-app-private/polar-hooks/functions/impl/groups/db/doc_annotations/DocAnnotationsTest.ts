import {Visibility} from "polar-shared/src/datastore/Visibility";
import {MockIDocMetas} from "../../../datastore/MockIDocMetas";
import {DocAnnotations, DocMetaHolder, DocMetaHolders, IDocumentSnapshots, RecordHolder} from "./DocAnnotations";
import {Profile, UserIDStr} from "../Profiles";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {assert} from 'chai';
import {GroupIDStr} from "../Groups";
import {Objects} from "polar-shared/src/util/Objects";
import {assertJSON} from "polar-test/src/test/Assertions";

const uid = '10101';

const noUserProfileProvider = async (uid: UserIDStr) => undefined;

const fakeUserProfileProvider = async (uid: UserIDStr) => {

    const result: Profile = {
        id: '101001',
        name: "Alice Smith",
        handle: 'alicesmith',
        lastUpdated: ISODateTimeStrings.create()
    };

    return result;
};

const id = '2020202';

const createEmptyDocSnapshot = () => {
    return IDocumentSnapshots.create();
};

const createDocSnapshotWithAreaHighlight = (visibility: Visibility = Visibility.PUBLIC,
                                            groups?: ReadonlyArray<GroupIDStr> ) => {

    const docMetaRecordHolder: RecordHolder<DocMetaHolder> = {
        id,
        uid,
        visibility,
        groups,
        value: DocMetaHolders.create(MockIDocMetas.createWithAreaHighlight())
    };

    return IDocumentSnapshots.create(docMetaRecordHolder);

};

const createDocSnapshotWithTwoAreaHighlights = (visibility: Visibility = Visibility.PUBLIC,
                                                groups?: ReadonlyArray<GroupIDStr> ) => {

    const docMetaRecordHolder: RecordHolder<DocMetaHolder> = {
        id,
        uid,
        visibility,
        groups,
        value: DocMetaHolders.create(MockIDocMetas.createWithTwoAreaHighlights())
    };

    return IDocumentSnapshots.create(docMetaRecordHolder);

};

describe('DocAnnotations', function() {

    it("new with area highlight and profile", async function() {

        const before = createEmptyDocSnapshot();

        const after = createDocSnapshotWithAreaHighlight();

        const mutations = await DocAnnotations.computeDocAnnotationMutations(before, after, fakeUserProfileProvider);

        assert.equal(mutations.length, 1);

        assertJSON(mutations, [
            {
                "collection": "profile_doc_annotation",
                "type": "set",
                "value": {
                    "id": "1Eb9mH7px6WAAsFkm13amA8gkLEnDU2kvbSgjsitHcPSNNgj7C",
                    "docID": "12HJWrP8EaRdrxTvfzgoFPTF45FjkowS",
                    "annotationType": "AREA_HIGHLIGHT",
                    "original": {
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
                                "backend": "image",
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
                    "created": "2019-08-22T23:54:17.849Z",
                    "lastUpdated": "2019-08-22T23:54:22.721Z",
                    "profileID": "101001"
                }
            }
        ]);

    });
    it("new with area highlight and NO profile", async function() {

        const before = createEmptyDocSnapshot();

        const after = createDocSnapshotWithAreaHighlight();

        const mutations = await DocAnnotations.computeDocAnnotationMutations(before, after, noUserProfileProvider);

        assert.equal(mutations.length, 0);

    });
    it("delete area highlight with profile", async function() {


        const before = createDocSnapshotWithAreaHighlight();
        const after = createEmptyDocSnapshot();

        const mutations = await DocAnnotations.computeDocAnnotationMutations(before, after, fakeUserProfileProvider);

        assert.equal(mutations.length, 1);
        assertJSON(mutations, [
            {
                "collection": "profile_doc_annotation",
                "type": "delete",
                "value": {
                    "id": "1Eb9mH7px6WAAsFkm13amA8gkLEnDU2kvbSgjsitHcPSNNgj7C",
                    "docID": "12HJWrP8EaRdrxTvfzgoFPTF45FjkowS",
                    "annotationType": "AREA_HIGHLIGHT",
                    "original": {
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
                                "backend": "image",
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
                    "created": "2019-08-22T23:54:17.849Z",
                    "lastUpdated": "2019-08-22T23:54:22.721Z",
                    "profileID": "101001"
                }
            }
        ]);

    });
    it("area highlight and just changing document visibility back to private", async function() {


        const before = createDocSnapshotWithAreaHighlight(Visibility.PUBLIC);
        const after = createDocSnapshotWithAreaHighlight(Visibility.PRIVATE);

        const mutations = await DocAnnotations.computeDocAnnotationMutations(before, after, fakeUserProfileProvider);

        assert.equal(mutations.length, 1);
        assertJSON(mutations, [
            {
                "collection": "profile_doc_annotation",
                "type": "delete",
                "value": {
                    "id": "1Eb9mH7px6WAAsFkm13amA8gkLEnDU2kvbSgjsitHcPSNNgj7C",
                    "docID": "12HJWrP8EaRdrxTvfzgoFPTF45FjkowS",
                    "annotationType": "AREA_HIGHLIGHT",
                    "original": {
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
                                "backend": "image",
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
                    "created": "2019-08-22T23:54:17.849Z",
                    "lastUpdated": "2019-08-22T23:54:22.721Z",
                    "profileID": "101001"
                }
            }
        ]);

    });
    it("area highlight then add it to a group", async function() {

        const before = createDocSnapshotWithAreaHighlight(Visibility.PUBLIC, []);
        const after = createDocSnapshotWithAreaHighlight(Visibility.PUBLIC, ['12345']);

        const mutations = await DocAnnotations.computeDocAnnotationMutations(before, after, noUserProfileProvider);

        assert.equal(mutations.length, 1);
        assertJSON(mutations, [
            {
                "collection": "group_doc_annotation",
                "type": "set",
                "value": {
                    "id": "1ADg8RUg1aySboGd4wjRf5XrnUh5ZzG7k45HdD4wmxJx1vPSCX",
                    "docID": "12HJWrP8EaRdrxTvfzgoFPTF45FjkowS",
                    "annotationType": "AREA_HIGHLIGHT",
                    "original": {
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
                                "backend": "image",
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
                    "created": "2019-08-22T23:54:17.849Z",
                    "lastUpdated": "2019-08-22T23:54:22.721Z",
                    "groupID": "12345"
                }
            }
        ]);

    });
    it("public doc with just one new area highlight", async function() {

        const before = createDocSnapshotWithAreaHighlight(Visibility.PUBLIC);
        const after = createDocSnapshotWithTwoAreaHighlights(Visibility.PUBLIC);

        const mutations = await DocAnnotations.computeDocAnnotationMutations(before, after, fakeUserProfileProvider);

        assert.equal(mutations.length, 1);
        assertJSON(mutations, [
            {
                "collection": "profile_doc_annotation",
                "type": "set",
                "value": {
                    "id": "1jAvZAUeTGd4MZcK4SNSzqn3B6bBYuLAjGWcsCmUjfLy8UEeaG",
                    "docID": "12HJWrP8EaRdrxTvfzgoFPTF45FjkowS",
                    "annotationType": "AREA_HIGHLIGHT",
                    "original": {
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
                                "backend": "image",
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
                    "created": "2019-08-22T23:54:17.849Z",
                    "lastUpdated": "2019-08-22T23:54:22.721Z",
                    "profileID": "101001"
                }
            }
        ]);

    });

});
