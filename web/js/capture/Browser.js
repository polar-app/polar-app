"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Browser {
    constructor(opts) {
        this.show = true;
        this.offscreen = false;
        this.name = opts.name;
        this.description = opts.description;
        this.userAgent = opts.userAgent;
        this.deviceEmulation = opts.deviceEmulation;
        this.show = opts.show;
        this.offscreen = opts.offscreen;
        Object.assign(this, opts);
    }
}
exports.Browser = Browser;
//# sourceMappingURL=Browser.js.map