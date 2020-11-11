"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FlashcardTaskActions = void 0;
const React = __importStar(require("react"));
const FlashcardType_1 = require("polar-shared/src/metadata/FlashcardType");
const ClozeParser_1 = require("polar-spaced-repetition/src/spaced_repetition/scheduler/util/ClozeParser");
const Texts_1 = require("polar-shared/src/metadata/Texts");
const Preconditions_1 = require("polar-shared/src/Preconditions");
class FlashcardTaskActions {
    static create(flashcard, docAnnotation) {
        if (flashcard.type === FlashcardType_1.FlashcardType.BASIC_FRONT_BACK) {
            return this.createBasicFrontBackFlashcard(flashcard, docAnnotation);
        }
        else if (flashcard.type === FlashcardType_1.FlashcardType.CLOZE) {
            return this.createClozeFlashcard(flashcard, docAnnotation);
        }
        else {
            throw new Error("Type not yet supported: " + flashcard.type);
        }
    }
    static createBasicFrontBackFlashcard(flashcard, docAnnotation) {
        const front = Texts_1.Texts.toString(flashcard.fields.front);
        const back = Texts_1.Texts.toString(flashcard.fields.back);
        const result = {
            front: React.createElement("div", { dangerouslySetInnerHTML: { __html: front || "" } }),
            back: React.createElement("div", { dangerouslySetInnerHTML: { __html: back || "" } }),
            docAnnotation
        };
        return [result];
    }
    static createClozeFlashcard(flashcard, docAnnotation) {
        const cloze = Texts_1.Texts.toString(flashcard.fields.cloze || flashcard.fields.text);
        if (cloze === undefined) {
            const msg = "No cloze text found";
            console.warn(`${msg}: `, flashcard);
            throw new Error(msg);
        }
        Preconditions_1.Preconditions.assertPresent(cloze, 'cloze');
        const regions = ClozeParser_1.ClozeParser.toRegions(cloze);
        const identifiers = regions.filter(current => current.type === 'cloze')
            .map(current => current.id);
        if (identifiers.length === 0) {
            console.warn(`No cloze texts parsed from '${cloze}': `, regions);
            return [];
        }
        const clozeAsText = ClozeParser_1.ClozeParser.regionsToText(regions);
        const regionToElement = (region, id) => {
            if (region.type === 'cloze' && region.id === id) {
                return `<span class="text-danger font-weight-bold">[...]</span>`;
            }
            else {
                return region.text;
            }
        };
        const toFlashcard = (id) => {
            const front = regions.map(region => regionToElement(region, id)).join('');
            return {
                front: React.createElement("div", { dangerouslySetInnerHTML: { __html: front } }),
                back: React.createElement("div", { dangerouslySetInnerHTML: { __html: clozeAsText } }),
                docAnnotation
            };
        };
        return identifiers.map(toFlashcard);
    }
}
exports.FlashcardTaskActions = FlashcardTaskActions;
//# sourceMappingURL=FlashcardTaskActions.js.map