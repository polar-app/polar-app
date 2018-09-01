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
const SpectronSpec_1 = require("../../js/test/SpectronSpec");
const Spectron_1 = require("../../js/test/Spectron");
const MockPHZWriter_1 = require("../../js/phz/MockPHZWriter");
describe("CacheInterceptorService", function () {
    this.timeout(10000);
    Spectron_1.Spectron.setup(__dirname);
    let path = "/tmp/cache-interceptor-service.phz";
    before(function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield MockPHZWriter_1.MockPHZWriter.write(path);
        });
    });
    it('Load PHZ file via cache', function () {
        return __awaiter(this, void 0, void 0, function* () {
            yield SpectronSpec_1.SpectronSpec.create(this.app).waitFor(true);
        });
    });
});
//# sourceMappingURL=spec.js.map