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
exports.AnnotationToggler = void 0;
const Promises_1 = require("../util/Promises");
const MIN_PAINT_INTERVAL = 1000 / 60;
class AnnotationToggler {
    constructor() {
        this.SELECTOR = ".page .pagemark, .page .text-highlight, .page .area-highlight";
        this.annotationStyles = [];
    }
    getAnnotationElements() {
        return Array.from(document.querySelectorAll(this.SELECTOR));
    }
    hide() {
        return __awaiter(this, void 0, void 0, function* () {
            yield Promises_1.Promises.requestAnimationFrame(() => this.hideAnnotations());
            yield Promises_1.Promises.waitFor(MIN_PAINT_INTERVAL);
        });
    }
    hideAnnotations() {
        for (const annotationElement of this.getAnnotationElements()) {
            const styleRestore = {
                visibility: annotationElement.style.visibility
            };
            annotationElement.style.visibility = 'hidden';
            this.annotationStyles.push({ element: annotationElement, styleRestore });
        }
    }
    show() {
        for (const annotationStyle of this.annotationStyles) {
            annotationStyle.element.style.visibility =
                annotationStyle.styleRestore.visibility;
        }
    }
}
exports.AnnotationToggler = AnnotationToggler;
//# sourceMappingURL=AnnotationToggler.js.map