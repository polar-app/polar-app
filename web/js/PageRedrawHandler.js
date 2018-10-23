"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class PageRedrawHandler {
    constructor(pageElement) {
        this.pageElement = pageElement;
        this.listener = null;
    }
    register(callback) {
        this.listener = (event) => {
            if (event.target && event.target.className === "endOfContent") {
                callback(this.pageElement);
            }
        };
        this.pageElement.addEventListener('DOMNodeInserted', this.listener, false);
    }
    ;
    unregister() {
        this.pageElement.removeEventListener('DOMNodeInserted', this.listener, false);
    }
}
exports.PageRedrawHandler = PageRedrawHandler;
//# sourceMappingURL=PageRedrawHandler.js.map