"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AnalyticsLocationListener = void 0;
const React = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const AnalyticsURLCanonicalizer_1 = require("./AnalyticsURLCanonicalizer");
const Analytics_1 = require("./Analytics");
exports.AnalyticsLocationListener = React.memo(() => {
    const location = react_router_dom_1.useLocation();
    try {
        const path = AnalyticsURLCanonicalizer_1.AnalyticsURLCanonicalizer.canonicalize(location.pathname + location.hash || "");
        const hostname = window.location.hostname;
        const title = document.title;
        console.log(`Location change: `, { path, hostname, title });
        Analytics_1.Analytics.page(path);
    }
    catch (e) {
        console.error("Unable to handle nav change", e);
    }
    return null;
});
//# sourceMappingURL=AnalyticsLocationListener.js.map