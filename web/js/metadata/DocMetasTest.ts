import {assert} from 'chai';
import {DocMeta} from './DocMeta';
import {DocMetas} from './DocMetas';
import {MetadataSerializer} from './MetadataSerializer';
import {assertJSON} from '../test/Assertions';
import {PagemarkType} from './PagemarkType';
import {TestingTime} from '../test/TestingTime';
import {TextHighlights} from './TextHighlights';
import {Proxies} from '../proxies/Proxies';

TestingTime.freeze();

describe('DocMetas', function() {

    describe('JSON', function() {

        it("Test basic JSON encoding and decoding", function() {

            const fingerprint = "0x001";

            const docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, 14);
            DocMetas.addPagemarks(docMeta, {nrPages: 1, offsetPage: 4, percentage: 50});

            const json = MetadataSerializer.serialize(docMeta, "  ");

            const actual = DocMetas.deserialize(json, fingerprint);

            assertJSON(docMeta, actual);

            assert.equal(actual instanceof DocMeta, true);


        });

        it("Test with default values for serialized data", function() {

            const json = "{}";

            const docMeta = DocMetas.deserialize(json, '0x000');

            assert.equal(docMeta instanceof DocMeta, true);

        });



    });

    describe('Deserialize', function() {

        it("Test Deserializing and then updating some pagemarks", function() {

            const fingerprint = "0x001";

            const nrPages = 2;
            let docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, nrPages);

            docMeta.docInfo.uuid = "__canonicalized__";

            const json = DocMetas.serialize(docMeta, "  ");

            const expected = {
                    "annotationInfo": {},
                    "version": 2,
                    "attachments": {},
                    "docInfo": {
                        "progress": 100,
                        "pagemarkType": "SINGLE_COLUMN",
                        "properties": {},
                        "archived": false,
                        "flagged": false,
                        "tags": {},
                        "nrPages": 2,
                        "fingerprint": "0x001",
                        "added": "2012-03-02T11:38:49.321Z",
                        "uuid": "__canonicalized__"
                    },
                    "pageMetas": {
                        "1": {
                            "pagemarks": {
                                "12CDjpvoCY": {
                                    "id": "12CDjpvoCY",
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
                            "comments": {},
                            "questions": {},
                            "flashcards": {},
                            "textHighlights": {},
                            "areaHighlights": {},
                            "screenshots": {},
                            "thumbnails": {},
                            "pageInfo": {
                                "num": 1
                            },
                        },
                        "2": {
                            "pagemarks": {
                                "12wfHNWzGf": {
                                    "id": "12wfHNWzGf",
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
                            "comments": {},
                            "questions": {},
                            "flashcards": {},
                            "textHighlights": {},
                            "areaHighlights": {},
                            "screenshots": {},
                            "thumbnails": {},
                            "pageInfo": {
                                "num": 2
                            },

                        }
                    }
                }
            ;

            assert.equal(typeof json, "string");

            assertJSON(json, expected);

            docMeta = DocMetas.deserialize(json, fingerprint);

            // now we have to trace it like it would be in production..
            docMeta = Proxies.create(docMeta);

            assertJSON(docMeta, expected);

            const pageMeta = docMeta.getPageMeta(1);

            (pageMeta as any).pagemarks = {};

            assert.deepEqual(docMeta.getPageMeta(1).pagemarks, {});

        });

    });


    describe('Upgrade', function() {

        describe("Test upgrading the metadata if it is missing fields.", function() {

            it("No DocInfo.pagemarkType", function() {

                let docMeta = createUpgradeDoc();

                assert.notEqual(docMeta.docInfo, null);
                delete (docMeta.getPageMeta(1) as any).textHighlights;

                delete docMeta.docInfo.pagemarkType;

                docMeta = DocMetas.upgrade(docMeta);

                assert.deepEqual(docMeta.docInfo.pagemarkType, PagemarkType.SINGLE_COLUMN);

            });

            it("Pagemark without rect", function() {
                let docMeta = createUpgradeDoc();

                console.log(Object.keys(docMeta.getPageMeta(1).pagemarks));

                delete docMeta.getPageMeta(1).pagemarks["1hajrtFtkP"].rect ;

                docMeta = DocMetas.upgrade(docMeta);

                const expected = {
                        "1hajrtFtkP": {
                            "id": "1hajrtFtkP",
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

            it("No text highlights", function() {

                let docMeta = createUpgradeDoc();

                delete (docMeta.getPageMeta(1) as any).textHighlights;

                docMeta = DocMetas.upgrade(docMeta);

                assert.deepEqual(docMeta.getPageMeta(1).textHighlights, {});

            });

            it("No pagemarks", function() {

                let docMeta = createUpgradeDoc();

                delete (docMeta.getPageMeta(1) as any).pagemarks;

                docMeta = DocMetas.upgrade(docMeta);

                assert.deepEqual(docMeta.getPageMeta(1).pagemarks, {});

            });

            it("No id on pagemarks", function() {

                let docMeta = createUpgradeDoc();

                console.log(JSON.stringify(docMeta.getPageMeta(1).pagemarks, null, "  "));

                console.log(Object.keys(docMeta.getPageMeta(1).pagemarks));

                (<any> (docMeta.getPageMeta(1).pagemarks["12cyUyU3s3"].id)) = null;

                docMeta = DocMetas.upgrade(docMeta);

                const expected = {
                        "12cyUyU3s3": {
                            "id": "12cyUyU3s3",
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

            it("No id on text highlights", function() {

                let docMeta = createUpgradeDoc();

                delete docMeta.getPageMeta(1).textHighlights["12pNUv1Y9S"].id;

                docMeta = DocMetas.upgrade(docMeta);

                const expected = {
                    "12pNUv1Y9S": {
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
                        "color": "yellow",
                        "id": "1cAbqEAHny"
                    }
                };

                assertJSON(docMeta.getPageMeta(1).textHighlights, expected);

            });

        });

    });

});

function createUpgradeDoc() {

    const fingerprint = "0x001";
    const nrPages = 1;
    const docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, nrPages);

    const textHighlight = TextHighlights.createMockTextHighlight();

    docMeta.getPageMeta(1).textHighlights[textHighlight.id] = textHighlight;

    return docMeta;

}
