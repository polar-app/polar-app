import assert from 'assert';
import {DocMeta} from './DocMeta';
import {DocMetas} from './DocMetas';
import {MetadataSerializer} from './MetadataSerializer';
import {assertJSON} from '../test/Assertions';
import {PagemarkType} from './PagemarkType';

const {Proxies} = require("../proxies/Proxies");
const {TextHighlights} = require("./TextHighlights");
const {TestingTime} = require("../test/TestingTime");

TestingTime.freeze();

describe('DocMetas', function() {

    describe('JSON', function() {

        it("Test basic JSON encoding and decoding", function () {

            let fingerprint = "0x001";

            let docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, 14);
            DocMetas.addPagemarks(docMeta, {nrPages: 1, offsetPage: 4, percentage: 50})

            let json = MetadataSerializer.serialize(docMeta, "  ");

            let actual = DocMetas.deserialize(json);

            assertJSON(docMeta, actual);

            assert.equal(actual instanceof DocMeta, true)


        });

        it("Test with default values for serialized data", function () {

            let json = "{}";

            let docMeta = DocMetas.deserialize(json);

            assert.equal(docMeta instanceof DocMeta, true);

        });



    });

    describe('Deserialize', function() {

        it("Test Deserializing and then updating some pagemarks", function () {

            let fingerprint = "0x001";

            let nrPages = 2;
            let docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, nrPages);

            let json = DocMetas.serialize(docMeta, "  ");

            let expected = {
                    "annotationInfo": {},
                    "version": 1,
                    "docInfo": {
                        "progress": 0,
                        "pagemarkType": "SINGLE_COLUMN",
                        "properties": {},
                        "nrPages": 2,
                        "fingerprint": "0x001"
                    },
                    "pageMetas": {
                        "1": {
                            "pagemarks": {
                                "0": {
                                    "id": "12Vf1bAzeo",
                                    "created": "2012-03-02T11:38:49.321Z",
                                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                                    "type": "SINGLE_COLUMN",
                                    "percentage": 100,
                                    "column": 0,
                                    "rect": {
                                        "left": 0,
                                        "top": 0,
                                        "width": 100,
                                        "height": 100
                                    },
                                    "notes": {},
                                    "mode": "READ"
                                }
                            },
                            "notes": {},
                            "questions": {},
                            "flashcards": {},
                            "textHighlights": {},
                            "areaHighlights": {},
                            "pageInfo": {
                                "num": 1
                            },
                        },
                        "2": {
                            "pagemarks": {
                                "0": {
                                    "id": "12Vf1bAzeo",
                                    "created": "2012-03-02T11:38:49.321Z",
                                    "lastUpdated": "2012-03-02T11:38:49.321Z",
                                    "type": "SINGLE_COLUMN",
                                    "percentage": 100,
                                    "column": 0,
                                    "rect": {
                                        "left": 0,
                                        "top": 0,
                                        "width": 100,
                                        "height": 100
                                    },
                                    "notes": {},
                                    "mode": "READ"
                                }
                            },
                            "notes": {},
                            "questions": {},
                            "flashcards": {},
                            "textHighlights": {},
                            "areaHighlights": {},
                            "pageInfo": {
                                "num": 2
                            },

                        }
                    }
                }
            ;

            assert.equal(typeof json, "string");

            assertJSON(json, expected);

            docMeta = DocMetas.deserialize(json);

            // now we have to trace it like it would be in production..
            docMeta = Proxies.create(docMeta);

            assertJSON(docMeta, expected);

            let pageMeta = docMeta.getPageMeta(1);

            pageMeta.pagemarks = {};

            assert.deepEqual(docMeta.getPageMeta(1).pagemarks, {})

        });

    });


    describe('Upgrade', function() {

        describe("Test upgrading the metadata if it is missing fields.", function () {

            it("No DocInfo.pagemarkType", function () {

                let docMeta = createUpgradeDoc();

                assert.notEqual(docMeta.docInfo, null);
                delete docMeta.getPageMeta(1).textHighlights;

                delete docMeta.docInfo.pagemarkType;

                docMeta = DocMetas.upgrade(docMeta)

                assert.deepEqual(docMeta.docInfo.pagemarkType, PagemarkType.SINGLE_COLUMN);

            });

            it("Pagemark without rect", function () {
                let docMeta = createUpgradeDoc();

                delete docMeta.getPageMeta(1).pagemarks["0"].rect ;

                docMeta = DocMetas.upgrade(docMeta);

                let expected = {
                        "0": {
                            "id": "12Vf1bAzeo",
                            "created": "2012-03-02T11:38:49.321Z",
                            "lastUpdated": "2012-03-02T11:38:49.321Z",
                            "type": "SINGLE_COLUMN",
                            "percentage": 100,
                            "column": 0,
                            "notes": {},
                            "mode": "READ",
                            "rect": {
                                "left": 0,
                                "top": 0,
                                "width": 100,
                                "height": 100
                            }
                        }
                    };

                assertJSON(docMeta.getPageMeta(1).pagemarks, expected);

            });

            it("No text highlights", function () {

                let docMeta = createUpgradeDoc();

                delete docMeta.getPageMeta(1).textHighlights;

                docMeta = DocMetas.upgrade(docMeta)

                assert.deepEqual(docMeta.getPageMeta(1).textHighlights, {});

            });

            it("No pagemarks", function () {

                let docMeta = createUpgradeDoc();

                delete docMeta.getPageMeta(1).pagemarks;

                docMeta = DocMetas.upgrade(docMeta)

                assert.deepEqual(docMeta.getPageMeta(1).pagemarks, {});

            });

            it("No id on pagemarks", function () {

                let docMeta = createUpgradeDoc();

                docMeta.getPageMeta(1).pagemarks["0"].id = null;

                docMeta = DocMetas.upgrade(docMeta);

                let expected = {
                        "0": {
                            "id": "12Vf1bAzeo",
                            "created": "2012-03-02T11:38:49.321Z",
                            "lastUpdated": "2012-03-02T11:38:49.321Z",
                            "type": "SINGLE_COLUMN",
                            "percentage": 100,
                            "column": 0,
                            "rect": {
                                "left": 0,
                                "top": 0,
                                "width": 100,
                                "height": 100
                            },
                            "notes": {},
                            "mode": "READ"

                        }
                    }
                ;

                assertJSON(docMeta.getPageMeta(1).pagemarks, expected);

            });

            it("No id on text highlights", function () {

                let docMeta = createUpgradeDoc();

                delete docMeta.getPageMeta(1).textHighlights["12pNUv1Y9S"].id;

                docMeta = DocMetas.upgrade(docMeta)

                let expected = {
                    "12pNUv1Y9S": {
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
                            "0": "hello world"
                        },
                        "text": "hello world",
                        "notes": {},
                        "questions": {},
                        "flashcards": {},
                        "id": "1cAbqEAHny",
                    }
                };

                assertJSON(docMeta.getPageMeta(1).textHighlights, expected);

            });

        });

    });

});

function createUpgradeDoc() {

    let fingerprint = "0x001";
    let nrPages = 1;
    let docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, nrPages);

    let textHighlight = TextHighlights.createMockTextHighlight();

    docMeta.getPageMeta(1).textHighlights[textHighlight.id] = textHighlight;

    return docMeta;

}
