"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { AppAnalytics } = require("./AppAnalytics");
const Analytics = require('electron-google-analytics').default;
class GA {
    static getInstance(userAgent) {
        if (this.analytics === undefined) {
            this.analytics = new Analytics('UA-122721184-1', { userAgent });
        }
        return this.analytics;
    }
    static getAppAnalytics(userAgent) {
        return new AppAnalytics(this.getInstance(userAgent));
    }
}
exports.GA = GA;
//# sourceMappingURL=GA.js.map