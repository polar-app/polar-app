"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Logger_1 = require("../../../../logger/Logger");
const log = Logger_1.Logger.create();
class FormHandler {
    onChange(data) {
        log.info("onChange: ", data);
    }
    onSubmit(data) {
        log.info("onSubmit: ", data);
    }
    onError(data) {
        log.info("onError: ", data);
    }
}
exports.FormHandler = FormHandler;
//# sourceMappingURL=FormHandler.js.map