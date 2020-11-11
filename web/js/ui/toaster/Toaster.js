"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ToasterMessageType = exports.Toaster = void 0;
const toastr_1 = __importDefault(require("toastr"));
const Optional_1 = require("polar-shared/src/util/ts/Optional");
toastr_1.default.options.toastClass = 'toastr';
class Toaster {
    static info(message, title = "", options = {}) {
        title = Optional_1.Optional.of(title).getOrElse("");
        return toastr_1.default.info(message, title, this.augmentExtendedOptions(options));
    }
    static success(message, title = "", options = {}) {
        title = Optional_1.Optional.of(title).getOrElse("");
        return toastr_1.default.success(message, title, this.augmentExtendedOptions(options));
    }
    static warning(message, title = "", options = {}) {
        title = Optional_1.Optional.of(title).getOrElse("");
        return toastr_1.default.warning(message, title, this.augmentExtendedOptions(options));
    }
    static error(message, title = "", options = {}) {
        title = Optional_1.Optional.of(title).getOrElse("");
        return toastr_1.default.error(message, title, this.augmentExtendedOptions(options));
    }
    static clear(ref) {
        toastr_1.default.clear(ref, { force: true });
    }
    static remove() {
        toastr_1.default.remove();
    }
    static persistentError(message, title = "") {
        this.error(message, title, {
            timeOut: 0,
            extendedTimeOut: 0,
            preventDuplicates: true
        });
    }
    static augmentExtendedOptions(options) {
        let result = Object.assign({}, options);
        if (options.requiresAcknowledgment) {
            result = Object.assign(Object.assign({}, result), { closeButton: true, timeOut: 0, extendedTimeOut: 0 });
        }
        return result;
    }
}
exports.Toaster = Toaster;
var ToasterMessageType;
(function (ToasterMessageType) {
    ToasterMessageType["SUCCESS"] = "success";
    ToasterMessageType["INFO"] = "info";
    ToasterMessageType["WARNING"] = "warning";
    ToasterMessageType["ERROR"] = "error";
})(ToasterMessageType = exports.ToasterMessageType || (exports.ToasterMessageType = {}));
//# sourceMappingURL=Toaster.js.map