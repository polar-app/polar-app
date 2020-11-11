"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const assert = __importStar(require("assert"));
const BrowserWindowRegistry_1 = require("./BrowserWindowRegistry");
const Assertions_1 = require("../../test/Assertions");
const Preconditions_1 = require("polar-shared/src/Preconditions");
describe('BrowserWindowRegistry', function () {
    class MockLiveWindowsProvider {
        constructor() {
            this.result = [];
        }
        getLiveWindowIDs() {
            return this.result;
        }
    }
    it("make sure GC works", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const mockLiveWindowsProvider = new MockLiveWindowsProvider();
            mockLiveWindowsProvider.result = [1];
            BrowserWindowRegistry_1.BrowserWindowRegistry.liveWindowsProvider = mockLiveWindowsProvider;
            assert.deepStrictEqual(BrowserWindowRegistry_1.BrowserWindowRegistry.gc(), []);
            BrowserWindowRegistry_1.BrowserWindowRegistry.tag(1, { 'name': 'test' });
            assert.deepStrictEqual(BrowserWindowRegistry_1.BrowserWindowRegistry.gc(), []);
            mockLiveWindowsProvider.result = [];
            assert.deepStrictEqual(BrowserWindowRegistry_1.BrowserWindowRegistry.gc(), [1]);
        });
    });
    it("basic tagging", function () {
        return __awaiter(this, void 0, void 0, function* () {
            const mockLiveWindowsProvider = new MockLiveWindowsProvider();
            mockLiveWindowsProvider.result = [1];
            BrowserWindowRegistry_1.BrowserWindowRegistry.liveWindowsProvider = mockLiveWindowsProvider;
            BrowserWindowRegistry_1.BrowserWindowRegistry.tag(1, { name: 'test' });
            const expected = {
                "tags": {
                    "name": "test"
                }
            };
            assert.ok(Preconditions_1.isPresent(BrowserWindowRegistry_1.BrowserWindowRegistry.get(1)));
            Assertions_1.assertJSON(BrowserWindowRegistry_1.BrowserWindowRegistry.get(1), expected);
            Assertions_1.assertJSON(BrowserWindowRegistry_1.BrowserWindowRegistry.tagged({ name: 'name', value: 'test' }), [1]);
        });
    });
});
//# sourceMappingURL=BrowserWindowRegistryTest.js.map