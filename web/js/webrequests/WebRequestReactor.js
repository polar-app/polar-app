"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Preconditions_1 = require("../Preconditions");
const Reactor_1 = require("../reactor/Reactor");
class WebRequestReactor {
    constructor(webRequest) {
        this.started = false;
        this.webRequest = webRequest;
        this.reactor = new Reactor_1.Reactor();
        this.started = false;
    }
    start() {
        this.webRequest.onBeforeRedirect(this.handleBeforeRedirect.bind(this));
        this.webRequest.onBeforeRequest(this.handleBeforeRequest.bind(this));
        this.webRequest.onBeforeSendHeaders(this.handleBeforeSendHeaders.bind(this));
        this.webRequest.onCompleted(this.handleCompleted.bind(this));
        this.webRequest.onErrorOccurred(this.handleErrorOccurred.bind(this));
        this.webRequest.onResponseStarted(this.handleResponseStarted.bind(this));
        this.webRequest.onSendHeaders(this.handleSendHeaders.bind(this));
        this.started = true;
    }
    stop() {
        this.started = false;
    }
    register(callback) {
        Preconditions_1.Preconditions.assertNotNull(callback, "callback");
        if (!this.started) {
            throw new Error("Not started!");
        }
        this.reactor.eventNames().forEach(eventName => {
            this.reactor.addEventListener(eventName, callback);
        });
    }
    handleBeforeRequest(details, callback) {
        this.handleEvent({
            name: 'onBeforeRequest',
            details,
            callback,
        });
    }
    handleBeforeSendHeaders(details, callback) {
        this.handleEvent({
            name: 'onBeforeSendHeaders',
            details,
            callback,
        });
    }
    handleBeforeRedirect(details) {
        this.handleEvent({
            name: 'onBeforeRedirect',
            details
        });
    }
    handleCompleted(details) {
        this.handleEvent({
            name: 'onCompleted',
            details,
        });
    }
    handleErrorOccurred(details) {
        this.handleEvent({
            name: 'onErrorOccurred',
            details,
        });
    }
    handleResponseStarted(details) {
        this.handleEvent({
            name: 'onResponseStarted',
            details,
        });
    }
    handleSendHeaders(details) {
        this.handleEvent({
            name: 'onSendHeaders',
            details,
        });
    }
    handleEvent(event, callback) {
        if (!this.started) {
            if (callback) {
                callback({ cancel: false });
            }
            return;
        }
        this.reactor.dispatchEvent(event.name, event);
    }
}
exports.WebRequestReactor = WebRequestReactor;
//# sourceMappingURL=WebRequestReactor.js.map