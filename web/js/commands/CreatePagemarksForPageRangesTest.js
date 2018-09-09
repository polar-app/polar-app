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
const chai_1 = require("chai");
const DiskDatastore_1 = require("../datastore/DiskDatastore");
const CreatePagemarksForPageRanges_1 = require("./CreatePagemarksForPageRanges");
const DefaultPersistenceLayer_1 = require("../datastore/DefaultPersistenceLayer");
xdescribe('Create ranges', function () {
    xdescribe('with real data', function () {
        xit("my bitcoin book.", function () {
            return __awaiter(this, void 0, void 0, function* () {
                const datastore = new DiskDatastore_1.DiskDatastore();
                const persistenceLayer = new DefaultPersistenceLayer_1.DefaultPersistenceLayer(datastore);
                yield persistenceLayer.init();
                const fingerprint = "65393761393531623135393737626562666234373866653365396535313036623631346666376461623662383239616439666637353064393132643133353030";
                const docMeta = yield persistenceLayer.getDocMeta(fingerprint);
                chai_1.assert.ok(docMeta !== undefined);
                const createPagemarksForPageRanges = new CreatePagemarksForPageRanges_1.CreatePagemarksForPageRanges(docMeta);
                createPagemarksForPageRanges.execute({ range: { start: 1, end: 204 } });
                yield persistenceLayer.sync(fingerprint, docMeta);
            });
        });
    });
});
//# sourceMappingURL=CreatePagemarksForPageRangesTest.js.map