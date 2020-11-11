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
exports.MockAdvertisingPersistenceLayer = void 0;
const AbstractAdvertisingPersistenceLayer_1 = require("./AbstractAdvertisingPersistenceLayer");
class MockAdvertisingPersistenceLayer extends AbstractAdvertisingPersistenceLayer_1.AbstractAdvertisingPersistenceLayer {
    constructor(persistenceLayer, noDispatchEvent = false) {
        super(persistenceLayer);
        this.id = 'mock';
        this.noDispatchEvent = noDispatchEvent;
    }
    init() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    stop() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
    broadcastEvent(event) {
        if (this.noDispatchEvent) {
            return;
        }
        this.dispatchEvent(event);
    }
}
exports.MockAdvertisingPersistenceLayer = MockAdvertisingPersistenceLayer;
//# sourceMappingURL=MockAdvertisingPersistenceLayer.js.map