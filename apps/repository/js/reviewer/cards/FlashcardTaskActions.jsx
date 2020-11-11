"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashcardTaskActions = void 0;
var React = require("react");
var FlashcardType_1 = require("polar-shared/src/metadata/FlashcardType");
var ClozeParser_1 = require("polar-spaced-repetition/src/spaced_repetition/scheduler/util/ClozeParser");
var Texts_1 = require("polar-shared/src/metadata/Texts");
var Preconditions_1 = require("polar-shared/src/Preconditions");
var FlashcardTaskActions = /** @class */ (function () {
    function FlashcardTaskActions() {
    }
    FlashcardTaskActions.create = function (flashcard, docAnnotation) {
        if (flashcard.type === FlashcardType_1.FlashcardType.BASIC_FRONT_BACK) {
            return this.createBasicFrontBackFlashcard(flashcard, docAnnotation);
        }
        else if (flashcard.type === FlashcardType_1.FlashcardType.CLOZE) {
            return this.createClozeFlashcard(flashcard, docAnnotation);
        }
        else {
            throw new Error("Type not yet supported: " + flashcard.type);
        }
    };
    FlashcardTaskActions.createBasicFrontBackFlashcard = function (flashcard, docAnnotation) {
        var front = Texts_1.Texts.toString(flashcard.fields.front);
        var back = Texts_1.Texts.toString(flashcard.fields.back);
        var result = {
            front: <div dangerouslySetInnerHTML={{ __html: front || "" }}/>,
            back: <div dangerouslySetInnerHTML={{ __html: back || "" }}/>,
            docAnnotation: docAnnotation
        };
        return [result];
    };
    FlashcardTaskActions.createClozeFlashcard = function (flashcard, docAnnotation) {
        var cloze = Texts_1.Texts.toString(flashcard.fields.cloze || flashcard.fields.text);
        if (cloze === undefined) {
            var msg = "No cloze text found";
            console.warn(msg + ": ", flashcard);
            throw new Error(msg);
        }
        Preconditions_1.Preconditions.assertPresent(cloze, 'cloze');
        var regions = ClozeParser_1.ClozeParser.toRegions(cloze);
        // the identifiers for all the cloze deletions to expand
        var identifiers = regions.filter(function (current) { return current.type === 'cloze'; })
            .map(function (current) { return current.id; });
        if (identifiers.length === 0) {
            console.warn("No cloze texts parsed from '" + cloze + "': ", regions);
            return [];
        }
        var clozeAsText = ClozeParser_1.ClozeParser.regionsToText(regions);
        var regionToElement = function (region, id) {
            if (region.type === 'cloze' && region.id === id) {
                return "<span class=\"text-danger font-weight-bold\">[...]</span>";
            }
            else {
                return region.text;
            }
        };
        var toFlashcard = function (id) {
            var front = regions.map(function (region) { return regionToElement(region, id); }).join('');
            return {
                front: <div dangerouslySetInnerHTML={{ __html: front }}/>,
                back: <div dangerouslySetInnerHTML={{ __html: clozeAsText }}/>,
                docAnnotation: docAnnotation
            };
        };
        return identifiers.map(toFlashcard);
    };
    return FlashcardTaskActions;
}());
exports.FlashcardTaskActions = FlashcardTaskActions;
