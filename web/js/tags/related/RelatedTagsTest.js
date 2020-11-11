"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const RelatedTagsManager_1 = require("./RelatedTagsManager");
const Assertions_1 = require("../../test/Assertions");
const chai_1 = require("chai");
const Tags_1 = require("polar-shared/src/tags/Tags");
describe('RelatedTags', function () {
    const getTagDocsIndex = (relatedTags) => {
        return relatedTags.tagDocsIndex;
    };
    it("basic", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const relatedTags = new RelatedTagsManager_1.RelatedTagsManager();
            relatedTags.update('0x01', 'set', [Tags_1.Tags.create('linux')]);
            relatedTags.update('0x01', 'set', [Tags_1.Tags.create('microsoft')]);
            relatedTags.update('0x02', 'set', [Tags_1.Tags.create('linux')]);
            relatedTags.update('0x02', 'set', [Tags_1.Tags.create('google')]);
            relatedTags.update('0x03', 'set', [Tags_1.Tags.create('linux')]);
            relatedTags.update('0x03', 'set', [Tags_1.Tags.create('microsoft')]);
            relatedTags.update('0x04', 'set', [Tags_1.Tags.create('linux')]);
            relatedTags.update('0x04', 'set', [Tags_1.Tags.create('microsoft')]);
            relatedTags.update('0x05', 'set', [Tags_1.Tags.create('linux')]);
            relatedTags.update('0x05', 'set', [Tags_1.Tags.create('google')]);
            const tagDocsIndex = getTagDocsIndex(relatedTags);
            chai_1.assert.isDefined(tagDocsIndex);
            Assertions_1.assertJSON(tagDocsIndex, {
                "linux": {
                    "tag": "linux",
                    "docs": {
                        "0x01": true,
                        "0x02": true,
                        "0x03": true,
                        "0x04": true,
                        "0x05": true
                    }
                },
                "microsoft": {
                    "tag": "microsoft",
                    "docs": {
                        "0x01": true,
                        "0x03": true,
                        "0x04": true
                    }
                },
                "google": {
                    "tag": "google",
                    "docs": {
                        "0x02": true,
                        "0x05": true
                    }
                }
            }, undefined, true);
            const tagHits = relatedTags.compute(['linux']);
            Assertions_1.assertJSON(tagHits, [
                {
                    "tag": "microsoft",
                    "hits": 3
                },
                {
                    "tag": "google",
                    "hits": 2
                }
            ], undefined, true);
        });
    });
});
//# sourceMappingURL=RelatedTagsTest.js.map