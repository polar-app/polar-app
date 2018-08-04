"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../../logger/Logger");
const IPCEngines_1 = require("../../ipc/handler/IPCEngines");
const CreateAnnotationHandler_1 = require("./handlers/CreateAnnotationHandler");
const log = Logger_1.Logger.create();
class FlashcardsController {
    constructor(model) {
        this.model = model;
    }
    start() {
        let ipcEngine = IPCEngines_1.IPCEngines.renderer();
        ipcEngine.registry.registerPath('/api/annotations/create-annotation', new CreateAnnotationHandler_1.CreateAnnotationHandler(this.model));
        ipcEngine.start();
    }
    onCreateFlashcard(data) {
    }
}
exports.FlashcardsController = FlashcardsController;
//# sourceMappingURL=FlashcardsController.js.map