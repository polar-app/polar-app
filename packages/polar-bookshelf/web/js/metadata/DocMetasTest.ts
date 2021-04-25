import {assert} from 'chai';
import {DocMeta} from './DocMeta';
import {DocMetas, MockDocMetas} from './DocMetas';
import {MetadataSerializer} from './MetadataSerializer';
import {assertJSON} from '../test/Assertions';
import {PagemarkType} from 'polar-shared/src/metadata/PagemarkType';
import {TestingTime} from 'polar-shared/src/test/TestingTime';
import {TextHighlights} from './TextHighlights';
import {Pagemarks} from './Pagemarks';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";

TestingTime.freeze();

describe('DocMetas', function() {

    beforeEach(function() {
        Pagemarks.sequences.id = 0;
        Pagemarks.sequences.batch = 0;
    });

    describe('deserialize/serialize strategies', function () {

        it("legacy", () => {

            const fingerprint = '0x0001';
            const docMeta = DocMetas.create(fingerprint, 1);

            const deserialized = DocMetas.deserialize(JSON.stringify(docMeta), fingerprint)

            assertJSON(docMeta, deserialized);

        });

        it("modern", () => {

            const fingerprint = '0x0001';
            const docMeta = DocMetas.create(fingerprint, 1);

            const deserialized = DocMetas.deserialize(DocMetas.serialize(docMeta), fingerprint)

            assertJSON(docMeta, deserialized);

        });

    });

    describe('JSON', function() {

        it("Test basic JSON encoding and decoding", function() {

            const fingerprint = "0x001";

            const docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, 14);
            console.log(JSON.stringify(docMeta, null, "  "));

            DocMetas.addPagemarks(docMeta, {nrPages: 1, offsetPage: 4, percentage: 50});

            const json = MetadataSerializer.serialize(docMeta, "  ");

            const actual = DocMetas.deserialize(json, fingerprint);

            assertJSON(docMeta, actual);

            assert.equal(actual instanceof DocMeta, true);


        });

        it("One page", function() {

            const fingerprint = "0x001";

            const docMeta = DocMetas.create(fingerprint, 1);
            console.log(JSON.stringify(docMeta, null, "  "));

            // DocMetas.addPagemarks(docMeta, {nrPages: 1, offsetPage: 1, percentage: 50});

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

    it('No whitespace option', function() {

        // make sure no whitespace is used
        const fingerprint = "0x001";

        const docMeta = MockDocMetas.createMockDocMeta(fingerprint);
        const json = DocMetas.serialize(docMeta, "");

        assert.isTrue(json.startsWith("{\"annotationInfo\":{},\"version\":2,\"attachments\":{}"));

        assert.equal(json.indexOf("\n"), -1);


    });

    describe('Deserialize', function() {
        // noop
    });


    describe('Upgrade', function() {

        describe("Test upgrading the metadata if it is missing fields.", function() {

            it("No DocInfo.pagemarkType", function() {

                let docMeta = createUpgradeDoc();

                assert.notEqual(docMeta.docInfo, null);
                delete (DocMetas.getPageMeta(docMeta, 1) as any).textHighlights;

                delete (docMeta.docInfo as any).pagemarkType;

                docMeta = DocMetas.upgrade(docMeta);

                assert.deepEqual(docMeta.docInfo.pagemarkType, PagemarkType.SINGLE_COLUMN);

            });

            it("Pagemark without rect", function() {
                let docMeta = createUpgradeDoc();

                console.log(Object.keys(DocMetas.getPageMeta(docMeta, 1).pagemarks));

                assertJSON(Object.keys(DocMetas.getPageMeta(docMeta, 1).pagemarks), ["1s2gw2Mkwb"]);

                delete (DocMetas.getPageMeta(docMeta, 1).pagemarks["1s2gw2Mkwb"] as any).rect ;

                docMeta = DocMetas.upgrade(docMeta);

                const expected = {
                        "1s2gw2Mkwb": {
                            "batch": "1Y9CcEHSxc",
                            "column": 0,
                            "created": "2012-03-02T11:38:49.321Z",
                            "guid": "1s2gw2Mkwb",
                            "id": "1s2gw2Mkwb",
                            "lastUpdated": "2012-03-02T11:38:49.321Z",
                            "mode": "READ",
                            "notes": {},
                            "percentage": 100,
                            "rect": {
                                "height": 100,
                                "left": 0,
                                "top": 0,
                                "width": 100
                            },
                            "type": "SINGLE_COLUMN"
                        }
                    };

                assertJSON(DocMetas.getPageMeta(docMeta, 1).pagemarks, expected);

            });

            it("No text highlights", function() {

                let docMeta = createUpgradeDoc();

                delete (DocMetas.getPageMeta(docMeta, 1) as any).textHighlights;

                docMeta = DocMetas.upgrade(docMeta);

                assert.deepEqual(DocMetas.getPageMeta(docMeta, 1).textHighlights, {});

            });

            it("No pagemarks", function() {

                let docMeta = createUpgradeDoc();

                delete (DocMetas.getPageMeta(docMeta, 1) as any).pagemarks;

                docMeta = DocMetas.upgrade(docMeta);

                assert.deepEqual(DocMetas.getPageMeta(docMeta, 1).pagemarks, {});

            });

            it("No id on pagemarks", function() {

                let docMeta = createUpgradeDoc();

                console.log(JSON.stringify(DocMetas.getPageMeta(docMeta, 1).pagemarks, null, "  "));

                assertJSON(Object.keys(DocMetas.getPageMeta(docMeta, 1).pagemarks), ["1s2gw2Mkwb"]);

                (<any> (DocMetas.getPageMeta(docMeta, 1).pagemarks["1s2gw2Mkwb"].id)) = null;

                docMeta = DocMetas.upgrade(docMeta);

                const expected = {
                        "1s2gw2Mkwb": {
                            "batch": "1Y9CcEHSxc",
                            "column": 0,
                            "created": "2012-03-02T11:38:49.321Z",
                            "guid": "1s2gw2Mkwb",
                            "id": "1s2gw2Mkwb",
                            "lastUpdated": "2012-03-02T11:38:49.321Z",
                            "mode": "READ",
                            "notes": {},
                            "percentage": 100,
                            "rect": {
                                "height": 100,
                                "left": 0,
                                "top": 0,
                                "width": 100
                            },
                            "type": "SINGLE_COLUMN"
                        }
                    };

                assertJSON(DocMetas.getPageMeta(docMeta, 1).pagemarks, expected);

            });

            it("No id on text highlights", function() {

                let docMeta = createUpgradeDoc();

                delete (DocMetas.getPageMeta(docMeta, 1).textHighlights["12pNUv1Y9S"] as any).id;

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


                assertJSON(DocMetas.getPageMeta(docMeta, 1).textHighlights, expected);

            });

        });

    });

});

function createUpgradeDoc(): IDocMeta {

    const fingerprint = "0x001";
    const nrPages = 1;
    const docMeta = DocMetas.createWithinInitialPagemarks(fingerprint, nrPages);

    const textHighlight = TextHighlights.createMockTextHighlight();

    DocMetas.getPageMeta(docMeta, 1).textHighlights[textHighlight.id] = textHighlight;

    return docMeta;

}
