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
const DocumentReadyStates_1 = require("./DocumentReadyStates");
const jsdom_1 = require("jsdom");
const chai_1 = require("chai");
describe('DocumentReadyStates', function () {
    describe('waitForChanger', function () {
        let jsdom = new jsdom_1.JSDOM();
        let doc = jsdom.window.document;
        it("basic via event", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let mockReadyStateChanger = new DocumentReadyStates_1.MockReadyStateChanger('loading');
                let result = DocumentReadyStates_1.DocumentReadyStates.waitForChanger(doc, 'interactive', mockReadyStateChanger);
                mockReadyStateChanger.resolve();
                chai_1.assert.equal(yield result, DocumentReadyStates_1.ReadyStateResolution.EVENT);
            });
        });
        it("basic via direct", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let mockReadyStateChanger = new DocumentReadyStates_1.MockReadyStateChanger('loading');
                let result = DocumentReadyStates_1.DocumentReadyStates.waitForChanger(doc, 'loading', mockReadyStateChanger);
                chai_1.assert.equal(yield result, DocumentReadyStates_1.ReadyStateResolution.DIRECT);
            });
        });
        it("to via direct", function () {
            return __awaiter(this, void 0, void 0, function* () {
                let mockReadyStateChanger = new DocumentReadyStates_1.MockReadyStateChanger('loading');
                let result = DocumentReadyStates_1.DocumentReadyStates.waitForChanger(doc, 'complete', mockReadyStateChanger);
                mockReadyStateChanger.resolve();
                mockReadyStateChanger.resolve();
                chai_1.assert.equal(yield result, DocumentReadyStates_1.ReadyStateResolution.EVENT);
            });
        });
    });
    describe('meetsRequiredState', function () {
        it("basic", function () {
            chai_1.assert.equal(DocumentReadyStates_1.DocumentReadyStates.meetsRequiredState('interactive', 'interactive'), true);
        });
        it("full", function () {
            chai_1.assert.equal(DocumentReadyStates_1.DocumentReadyStates.meetsRequiredState('loading', 'complete'), true);
        });
    });
});
//# sourceMappingURL=DocumentReadyStatesTest.js.map