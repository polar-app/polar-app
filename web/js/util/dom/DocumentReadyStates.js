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
exports.MockReadyStateChanger = exports.DocumentReadyStateChanger = exports.ReadyStateResolution = exports.DocumentReadyStates = void 0;
class DocumentReadyStates {
    static waitFor(doc, requiredReadyState) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.waitForChanger(doc, requiredReadyState, new DocumentReadyStateChanger(doc));
        });
    }
    static waitForChanger(doc, requiredReadyState, readyStateChanger) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                readyStateChanger.awaitState(requiredReadyState)
                    .then(() => {
                    resolve(ReadyStateResolution.EVENT);
                })
                    .catch(err => reject(err));
                if (this.meetsRequiredState(requiredReadyState, readyStateChanger.readyState)) {
                    resolve(ReadyStateResolution.DIRECT);
                }
            });
        });
    }
    static meetsRequiredState(requiredReadyState, currentReadyState) {
        const requiredReadyStateCode = this.toReadyStateCode(requiredReadyState);
        const currentReadyStateCode = this.toReadyStateCode(currentReadyState);
        return currentReadyStateCode >= requiredReadyStateCode;
    }
    static toReadyStateCode(readyState) {
        switch (readyState) {
            case 'loading':
                return 1;
            case 'interactive':
                return 2;
            case 'complete':
                return 3;
        }
    }
}
exports.DocumentReadyStates = DocumentReadyStates;
var ReadyStateResolution;
(function (ReadyStateResolution) {
    ReadyStateResolution["DIRECT"] = "direct";
    ReadyStateResolution["EVENT"] = "event";
})(ReadyStateResolution = exports.ReadyStateResolution || (exports.ReadyStateResolution = {}));
class DocumentReadyStateChanger {
    constructor(doc) {
        this.doc = doc;
        this.readyState = doc.readyState;
    }
    awaitState(requiredReadyState) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                let listener = () => {
                    if (DocumentReadyStates.meetsRequiredState(requiredReadyState, this.doc.readyState)) {
                        resolve();
                        this.doc.removeEventListener('readystatechange', listener);
                    }
                };
                this.doc.addEventListener('readystatechange', listener);
            });
        });
    }
}
exports.DocumentReadyStateChanger = DocumentReadyStateChanger;
class MockReadyStateChanger {
    constructor(readyState) {
        this.resolve = () => { };
        this.readyState = readyState;
    }
    awaitState(requiredReadyState) {
        return new Promise(resolve => {
            this.resolve = resolve;
        });
    }
}
exports.MockReadyStateChanger = MockReadyStateChanger;
//# sourceMappingURL=DocumentReadyStates.js.map