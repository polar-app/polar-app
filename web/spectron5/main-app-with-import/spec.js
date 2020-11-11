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
const Spectron_1 = require("../../js/test/Spectron");
const SpectronSpec_1 = require("../../js/test/SpectronSpec");
const PolarDataDir_1 = require("../../js/test/PolarDataDir");
describe('main-app-with-import', function () {
    return __awaiter(this, void 0, void 0, function* () {
        Spectron_1.Spectron.setup(__dirname);
        this.timeout(300000);
        before(function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield PolarDataDir_1.PolarDataDir.useFreshDirectory('.polar-main-app-with-import');
            });
        });
        it('create the repository view', function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield SpectronSpec_1.SpectronSpec.create(this.app).waitFor(true);
            });
        });
    });
});
//# sourceMappingURL=spec.js.map