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
const Preconditions_1 = require("../../Preconditions");
const IFrames_1 = require("../../util/dom/IFrames");
const Logger_1 = require("../../logger/Logger");
const DocumentReadyStates_1 = require("../../util/dom/DocumentReadyStates");
const log = Logger_1.Logger.create();
class IFrameWatcher {
    constructor(iframe, callback) {
        this.iframe = Preconditions_1.Preconditions.assertNotNull(iframe, "iframe");
        this.callback = Preconditions_1.Preconditions.assertNotNull(callback, "callback");
    }
    start() {
        this.execute()
            .catch(err => log.error("Failed watching for iframe: ", err));
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            yield IFrames_1.IFrames.waitForContentDocument(this.iframe);
            yield DocumentReadyStates_1.DocumentReadyStates.waitFor(this.iframe.contentDocument, 'complete');
            this.callback();
        });
    }
}
exports.IFrameWatcher = IFrameWatcher;
//# sourceMappingURL=IFrameWatcher.js.map