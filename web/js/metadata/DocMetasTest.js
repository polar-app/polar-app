"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chai_1 = require("chai");
const DocMeta_1 = require("./DocMeta");
const DocMetas_1 = require("./DocMetas");
const MetadataSerializer_1 = require("./MetadataSerializer");
const Assertions_1 = require("../test/Assertions");
const PagemarkType_1 = require("polar-shared/src/metadata/PagemarkType");
const TestingTime_1 = require("polar-shared/src/test/TestingTime");
const TextHighlights_1 = require("./TextHighlights");
const Pagemarks_1 = require("./Pagemarks");
TestingTime_1.TestingTime.freeze();
describe('DocMetas', function () {
    beforeEach(function () {
        Pagemarks_1.Pagemarks.sequences.id = 0;
        Pagemarks_1.Pagemarks.sequences.batch = 0;
    });
    describe('JSON', function () {
        it("Test basic JSON encoding and decoding", function () {
            const fingerprint = "0x001";
            const docMeta = DocMetas_1.DocMetas.createWithinInitialPagemarks(fingerprint, 14);
            console.log(JSON.stringify(docMeta, null, "  "));
            DocMetas_1.DocMetas.addPagemarks(docMeta, { nrPages: 1, offsetPage: 4, percentage: 50 });
            const json = MetadataSerializer_1.MetadataSerializer.serialize(docMeta, "  ");
            const actual = DocMetas_1.DocMetas.deserialize(json, fingerprint);
            Assertions_1.assertJSON(docMeta, actual);
            chai_1.assert.equal(actual instanceof DocMeta_1.DocMeta, true);
        });
        it("One page", function () {
            const fingerprint = "0x001";
            const docMeta = DocMetas_1.DocMetas.create(fingerprint, 1);
            console.log(JSON.stringify(docMeta, null, "  "));
            const json = MetadataSerializer_1.MetadataSerializer.serialize(docMeta, "  ");
            const actual = DocMetas_1.DocMetas.deserialize(json, fingerprint);
            Assertions_1.assertJSON(docMeta, actual);
            chai_1.assert.equal(actual instanceof DocMeta_1.DocMeta, true);
        });
        it("Test with default values for serialized data", function () {
            const json = "{}";
            const docMeta = DocMetas_1.DocMetas.deserialize(json, '0x000');
            chai_1.assert.equal(docMeta instanceof DocMeta_1.DocMeta, true);
        });
    });
    it('No whitespace option', function () {
        const fingerprint = "0x001";
        const docMeta = DocMetas_1.MockDocMetas.createMockDocMeta(fingerprint);
        const json = DocMetas_1.DocMetas.serialize(docMeta, "");
        chai_1.assert.isTrue(json.startsWith("{\"annotationInfo\":{},\"version\":2,\"attachments\":{}"));
        chai_1.assert.equal(json.indexOf("\n"), -1);
    });
    describe('Deserialize', function () {
    });
    describe('Upgrade', function () {
        describe("Test upgrading the metadata if it is missing fields.", function () {
            it("No DocInfo.pagemarkType", function () {
                let docMeta = createUpgradeDoc();
                chai_1.assert.notEqual(docMeta.docInfo, null);
                delete DocMetas_1.DocMetas.getPageMeta(docMeta, 1).textHighlights;
                delete docMeta.docInfo.pagemarkType;
                docMeta = DocMetas_1.DocMetas.upgrade(docMeta);
                chai_1.assert.deepEqual(docMeta.docInfo.pagemarkType, PagemarkType_1.PagemarkType.SINGLE_COLUMN);
            });
            it("Pagemark without rect", function () {
                let docMeta = createUpgradeDoc();
                console.log(Object.keys(DocMetas_1.DocMetas.getPageMeta(docMeta, 1).pagemarks));
                Assertions_1.assertJSON(Object.keys(DocMetas_1.DocMetas.getPageMeta(docMeta, 1).pagemarks), ["1s2gw2Mkwb"]);
                delete DocMetas_1.DocMetas.getPageMeta(docMeta, 1).pagemarks["1s2gw2Mkwb"].rect;
                docMeta = DocMetas_1.DocMetas.upgrade(docMeta);
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
                Assertions_1.assertJSON(DocMetas_1.DocMetas.getPageMeta(docMeta, 1).pagemarks, expected);
            });
            it("No text highlights", function () {
                let docMeta = createUpgradeDoc();
                delete DocMetas_1.DocMetas.getPageMeta(docMeta, 1).textHighlights;
                docMeta = DocMetas_1.DocMetas.upgrade(docMeta);
                chai_1.assert.deepEqual(DocMetas_1.DocMetas.getPageMeta(docMeta, 1).textHighlights, {});
            });
            it("No pagemarks", function () {
                let docMeta = createUpgradeDoc();
                delete DocMetas_1.DocMetas.getPageMeta(docMeta, 1).pagemarks;
                docMeta = DocMetas_1.DocMetas.upgrade(docMeta);
                chai_1.assert.deepEqual(DocMetas_1.DocMetas.getPageMeta(docMeta, 1).pagemarks, {});
            });
            it("No id on pagemarks", function () {
                let docMeta = createUpgradeDoc();
                console.log(JSON.stringify(DocMetas_1.DocMetas.getPageMeta(docMeta, 1).pagemarks, null, "  "));
                Assertions_1.assertJSON(Object.keys(DocMetas_1.DocMetas.getPageMeta(docMeta, 1).pagemarks), ["1s2gw2Mkwb"]);
                (DocMetas_1.DocMetas.getPageMeta(docMeta, 1).pagemarks["1s2gw2Mkwb"].id) = null;
                docMeta = DocMetas_1.DocMetas.upgrade(docMeta);
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
                Assertions_1.assertJSON(DocMetas_1.DocMetas.getPageMeta(docMeta, 1).pagemarks, expected);
            });
            it("No id on text highlights", function () {
                let docMeta = createUpgradeDoc();
                delete DocMetas_1.DocMetas.getPageMeta(docMeta, 1).textHighlights["12pNUv1Y9S"].id;
                docMeta = DocMetas_1.DocMetas.upgrade(docMeta);
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
                Assertions_1.assertJSON(DocMetas_1.DocMetas.getPageMeta(docMeta, 1).textHighlights, expected);
            });
        });
    });
});
function createUpgradeDoc() {
    const fingerprint = "0x001";
    const nrPages = 1;
    const docMeta = DocMetas_1.DocMetas.createWithinInitialPagemarks(fingerprint, nrPages);
    const textHighlight = TextHighlights_1.TextHighlights.createMockTextHighlight();
    DocMetas_1.DocMetas.getPageMeta(docMeta, 1).textHighlights[textHighlight.id] = textHighlight;
    return docMeta;
}
//# sourceMappingURL=DocMetasTest.js.map