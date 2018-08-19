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
const Preconditions_1 = require("../Preconditions");
const Logger_1 = require("../logger/Logger");
const log = Logger_1.Logger.create();
class Controller {
    constructor(model) {
        this.model = Preconditions_1.Preconditions.assertNotNull(model, "model");
    }
    onDocumentLoaded(fingerprint, nrPages, currentlySelectedPageNum) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.model.documentLoaded(fingerprint, nrPages, currentlySelectedPageNum);
        });
    }
    createPagemark(pageNum, options) {
        return __awaiter(this, void 0, void 0, function* () {
            log.info("Controller sees pagemark created: " + pageNum, options);
            yield this.model.createPagemark(pageNum, options);
        });
    }
    erasePagemarks(pageNum) {
        log.info("Controller sees pagemarks erased: " + pageNum);
        this.model.erasePagemark(pageNum);
    }
    erasePagemark(num) {
        log.info("Controller sees pagemark erased: " + num);
        this.model.erasePagemark(num);
    }
    getCurrentPageElement() {
    }
}
exports.Controller = Controller;
//# sourceMappingURL=Controller.js.map