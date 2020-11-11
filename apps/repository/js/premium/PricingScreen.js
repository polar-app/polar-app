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
exports.PricingScreen = void 0;
const React = __importStar(require("react"));
const FixedNav_1 = require("../FixedNav");
const RepoFooter_1 = require("../repo_footer/RepoFooter");
const PricingStore_1 = require("./PricingStore");
const PricingContent_1 = require("./PricingContent");
const DefaultChangePlanContextProvider_1 = require("./actions/DefaultChangePlanContextProvider");
exports.PricingScreen = () => {
    return (React.createElement(PricingStore_1.PricingStoreProvider, null,
        React.createElement(DefaultChangePlanContextProvider_1.DefaultChangePlanContextProvider, null,
            React.createElement(FixedNav_1.FixedNav, { id: "doc-repository" },
                React.createElement(FixedNav_1.FixedNavBody, { className: "container-fluid" },
                    React.createElement("div", { className: "row" },
                        React.createElement("div", { className: "col-lg-12 w-100 pt-4" },
                            React.createElement(PricingContent_1.PricingContent, null)))),
                React.createElement(RepoFooter_1.RepoFooter, null)))));
};
//# sourceMappingURL=PricingScreen.js.map