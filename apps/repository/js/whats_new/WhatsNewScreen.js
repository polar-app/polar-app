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
const React = __importStar(require("react"));
const WhatsNewContent_1 = require("../splash2/whats_new/WhatsNewContent");
const FixedNav_1 = require("../FixedNav");
function WhatsNewScreen() {
    return (React.createElement(FixedNav_1.FixedNav, { id: "doc-repository" },
        React.createElement(FixedNav_1.FixedNavBody, { className: "container-fluid" },
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col-lg-12 w-100 pt-2" },
                    React.createElement(WhatsNewContent_1.WhatsNewContent, null))))));
}
exports.default = WhatsNewScreen;
//# sourceMappingURL=WhatsNewScreen.js.map