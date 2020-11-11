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
exports.WebDriverTestResultReader = void 0;
const Results_1 = require("polar-shared/src/util/Results");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const Latch_1 = require("polar-shared/src/util/Latch");
class WebDriverTestResultReader {
    constructor(app) {
        this.app = app;
    }
    read2() {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.app.client.executeAsync((done) => {
                function poll() {
                    if (window.SPECTRON_TEST_RESULT !== null &&
                        window.SPECTRON_TEST_RESULT !== undefined) {
                        done(window.SPECTRON_TEST_RESULT);
                        return;
                    }
                    setTimeout(poll, 250);
                }
                poll();
            });
            return Results_1.Results.create(result).get();
        });
    }
    read() {
        return __awaiter(this, void 0, void 0, function* () {
            const latch = new Latch_1.Latch();
            const poll = () => __awaiter(this, void 0, void 0, function* () {
                const response = yield this.app.client.executeAsync((done) => {
                    if (window.SPECTRON_TEST_RESULT !== null &&
                        window.SPECTRON_TEST_RESULT !== undefined) {
                        done(window.SPECTRON_TEST_RESULT);
                        return;
                    }
                    done(null);
                });
                const result = Results_1.Results.create(response).get();
                if (Preconditions_1.isPresent(result)) {
                    latch.resolve(result);
                }
                else {
                    setTimeout(() => {
                        poll().catch(err => latch.reject(err));
                    }, 250);
                }
            });
            poll().catch(err => latch.reject(err));
            return latch.get();
        });
    }
}
exports.WebDriverTestResultReader = WebDriverTestResultReader;
//# sourceMappingURL=WebDriverTestResultReader.js.map