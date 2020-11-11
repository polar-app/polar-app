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
const chai_1 = require("chai");
const Spectron_1 = require("../../js/test/Spectron");
const SpectronSpec_1 = require("../../js/test/SpectronSpec");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const Files_1 = require("polar-shared/src/util/Files");
const PolarDataDir_1 = require("../../js/test/PolarDataDir");
const Directories_1 = require("../../js/datastore/Directories");
describe('persistent-error-logger', function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield PolarDataDir_1.PolarDataDir.useFreshDirectory('.polar-persistent-error-logger');
        Spectron_1.Spectron.setup(__dirname);
        this.timeout(30000);
        it('test writing errors', function () {
            return __awaiter(this, void 0, void 0, function* () {
                const directories = new Directories_1.Directories();
                yield directories.init();
                chai_1.assert.ok(yield Files_1.Files.existsAsync(directories.logsDir));
                yield SpectronSpec_1.SpectronSpec.create(this.app).waitFor(true);
                const data = yield Files_1.Files.readFileAsync(FilePaths_1.FilePaths.create(directories.logsDir, 'error.log'));
                chai_1.assert.ok(data.indexOf('This is from the main process:') !== -1);
                chai_1.assert.ok(data.indexOf('Fake error in main process') !== -1);
                chai_1.assert.ok(data.indexOf('This is from the renderer process:') !== -1);
                chai_1.assert.ok(data.indexOf('Fake error in the renderer process') !== -1);
            });
        });
    });
});
//# sourceMappingURL=spec.js.map