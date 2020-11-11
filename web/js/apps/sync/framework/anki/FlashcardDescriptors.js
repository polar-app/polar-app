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
exports.FlashcardDescriptors = void 0;
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
const _ = __importStar(require("lodash"));
const FlashcardType_1 = require("polar-shared/src/metadata/FlashcardType");
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
class FlashcardDescriptors {
    static toFlashcardDescriptors(docMetaSupplierCollection) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = [];
            for (const docMetaSupplier of docMetaSupplierCollection) {
                try {
                    const docMeta = yield docMetaSupplier();
                    Object.values(docMeta.pageMetas).forEach(pageMeta => {
                        const flashcards = [];
                        flashcards.push(...Dictionaries_1.Dictionaries.values(pageMeta.flashcards));
                        flashcards.push(..._.chain(pageMeta.textHighlights)
                            .map(current => Dictionaries_1.Dictionaries.values(current.flashcards))
                            .flatten()
                            .value());
                        flashcards.push(..._.chain(pageMeta.areaHighlights)
                            .map(current => Dictionaries_1.Dictionaries.values(current.flashcards))
                            .flatten()
                            .value());
                        const flashcardDescriptors = _.chain(flashcards)
                            .map(current => ({
                            docMeta,
                            pageInfo: pageMeta.pageInfo,
                            flashcard: current
                        }))
                            .value();
                        result.push(...flashcardDescriptors);
                    });
                }
                catch (e) {
                    log.error("Unable to handle docMeta: ", e);
                }
            }
            return result;
        });
    }
    static toModelName(flashcardDescriptor) {
        if (flashcardDescriptor.flashcard.type === FlashcardType_1.FlashcardType.CLOZE) {
            return "Cloze";
        }
        return "Basic";
    }
}
exports.FlashcardDescriptors = FlashcardDescriptors;
//# sourceMappingURL=FlashcardDescriptors.js.map