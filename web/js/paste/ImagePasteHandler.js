"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
class ImagePasteHandler {
    constructor(element, mutator) {
        this.element = element;
        this.mutator = mutator;
        if (!this.mutator) {
            this.mutator = function (val) {
                return val;
            };
        }
    }
    start() {
        this.element.addEventListener("paste", function (event) {
            return __awaiter(this, void 0, void 0, function* () {
                let imagePasted = yield ImagePasteHandler.handlePasteData(event);
                if (imagePasted.image) {
                    event.preventDefault();
                    let text = imagePasted.image;
                    text = this.mutator(text);
                    document.execCommand("insertHTML", false, text);
                    return true;
                }
                return true;
            });
        }.bind(this));
    }
    ;
    static handlePasteData(e) {
        let orgEvent = e;
        for (let i = 0; i < orgEvent.clipboardData.items.length; i++) {
            let clipboardDataItem = orgEvent.clipboardData.items[i];
            if (clipboardDataItem.kind === "file" && clipboardDataItem.type === "image/png") {
                let imageFile = clipboardDataItem.getAsFile();
                let fileReader = new FileReader();
                return new Promise(function (resolve, reject) {
                    fileReader.onloadend = function () {
                        resolve({ image: fileReader.result });
                    };
                    fileReader.readAsDataURL(imageFile);
                });
            }
        }
        return new Promise(function (resolve) {
            resolve({});
        });
    }
}
exports.ImagePasteHandler = ImagePasteHandler;
;
//# sourceMappingURL=ImagePasteHandler.js.map