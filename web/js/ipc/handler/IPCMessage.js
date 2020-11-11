"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.IPCMessage = void 0;
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const ElectronContexts_1 = require("./ElectronContexts");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const log = Logger_1.Logger.create();
class IPCMessage {
    constructor(type, value, nonce = IPCMessage.createNonce(), error, context = ElectronContexts_1.ElectronContexts.create()) {
        if (value && value instanceof IPCMessage) {
            throw new Error("Value is already an IPCMessage");
        }
        this._type = type;
        this._value = value;
        this._nonce = nonce;
        this._context = context;
        this._error = error;
    }
    get type() {
        return this._type;
    }
    get value() {
        if (this._error) {
            throw new Error(this._error.msg);
        }
        if (!this._value) {
            throw new Error("Value was undefined and no error defined.");
        }
        return this._value;
    }
    get nonce() {
        return this._nonce;
    }
    get error() {
        return this._error;
    }
    get context() {
        return this._context;
    }
    computeResponseChannel() {
        return '/ipc/response:' + this.nonce;
    }
    static createNonce() {
        return Date.now();
    }
    static createError(type, error) {
        return new IPCMessage(type, undefined, IPCMessage.createNonce(), error);
    }
    static create(obj, valueFactory) {
        if (obj._value === undefined) {
            log.warn("IPC message missing value: ", obj);
        }
        obj._value = Optional_1.Optional.of(obj._value, "value")
            .getOrUndefined();
        if (Preconditions_1.isPresent(obj._value) && valueFactory) {
            obj._value = valueFactory(obj._value);
        }
        const result = Object.create(IPCMessage.prototype);
        Object.assign(result, obj);
        return result;
    }
}
exports.IPCMessage = IPCMessage;
//# sourceMappingURL=IPCMessage.js.map