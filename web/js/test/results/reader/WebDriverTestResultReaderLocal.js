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
exports.WebDriverTestResultReaderLocal = void 0;
const Results_1 = require("polar-shared/src/util/Results");
const ResolvablePromise_1 = require("../../../util/ResolvablePromise");
class WebDriverTestResultReaderLocal {
    constructor(app) {
        this.app = app;
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            const promise = new ResolvablePromise_1.ResolvablePromise();
            const poll = () => __awaiter(this, void 0, void 0, function* () {
                const result = yield this.app.client.executeAsync((done) => {
                    const windowResult = window.SPECTRON_TEST_RESULT;
                    if (windowResult !== null && windowResult !== undefined) {
                        done(windowResult);
                        return;
                    }
                    done(undefined);
                });
                if (result.value !== null && result.value !== undefined) {
                    promise.resolve(Results_1.Results.create(result).get());
                }
                else {
                    setTimeout(poll, 150);
                }
            });
            setTimeout(poll, 0);
            return promise;
        });
    }
}
exports.WebDriverTestResultReaderLocal = WebDriverTestResultReaderLocal;
//# sourceMappingURL=WebDriverTestResultReaderLocal.js.map