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
exports.SingletonBrowserWindow = void 0;
const electron_1 = require("electron");
const BrowserWindowRegistry_1 = require("./BrowserWindowRegistry");
const Logger_1 = require("polar-shared/src/logger/Logger");
const log = Logger_1.Logger.create();
class SingletonBrowserWindow {
    static getInstance(tag, browserWindowFactory, extraTags = {}) {
        return __awaiter(this, void 0, void 0, function* () {
            const existing = BrowserWindowRegistry_1.BrowserWindowRegistry.tagged(tag);
            if (existing.length === 1) {
                log.info("Found existing repository UI. Focusing.");
                const id = existing[0];
                const browserWindow = electron_1.BrowserWindow.fromId(id);
                browserWindow.focus();
                return browserWindow;
            }
            const result = yield browserWindowFactory();
            const tags = Object.assign({}, extraTags);
            tags[tag.name] = tag.value;
            BrowserWindowRegistry_1.BrowserWindowRegistry.tag(result.id, tags);
            return result;
        });
    }
}
exports.SingletonBrowserWindow = SingletonBrowserWindow;
//# sourceMappingURL=SingletonBrowserWindow.js.map