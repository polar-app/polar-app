"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Preconditions_1 = require("../Preconditions");
const { Reactor } = require("../reactor/Reactor");
class WebRequestReactor {
    constructor(webRequest) {
        this.started = false;
        this.webRequest = webRequest;
        this.reactor = new Reactor();
        this.started = false;
    }
    start() {
        const eventRegisterFunctions = this.toEventRegisterFunctions();
        let webRequestReactor = this;
        eventRegisterFunctions.forEach((eventRegisterFunction) => {
            let functionName = eventRegisterFunction.name;
            eventRegisterFunction = eventRegisterFunction.bind(this.webRequest);
            this.reactor.registerEvent(functionName);
            eventRegisterFunction((details, callback) => {
                if (webRequestReactor.started) {
                    this.reactor.dispatchEvent(functionName, functionName, details, callback);
                }
            });
        });
        this.started = true;
    }
    stop() {
        this.started = false;
        const eventRegisterFunctions = this.toEventRegisterFunctions();
        eventRegisterFunctions.forEach((eventRegisterFunction) => {
            let functionName = eventRegisterFunction.name;
            this.reactor.clearEvent(functionName);
            eventRegisterFunction = eventRegisterFunction.bind(this.webRequest);
            eventRegisterFunction((details, callback) => {
                if (callback)
                    callback({ cancel: false });
            });
        });
    }
    register(callback) {
        Preconditions_1.Preconditions.assertNotNull(callback, "callback");
        if (!this.started) {
            throw new Error("Not started!");
        }
        const eventRegisterFunctions = this.toEventRegisterFunctions();
        eventRegisterFunctions.forEach((eventRegisterFunction) => {
            let functionName = eventRegisterFunction.name;
            this.reactor.addEventListener(functionName, callback);
        });
    }
    toEventRegisterFunctions() {
        return [
            (listener) => this.webRequest.onBeforeRedirect(listener),
            (listener) => this.webRequest.onBeforeRequest((details, callback) => { listener(details, callback); }),
        ];
    }
}
exports.WebRequestReactor = WebRequestReactor;
//# sourceMappingURL=WebRequestReactor.js.map