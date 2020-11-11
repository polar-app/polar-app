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
exports.ViewerTours = void 0;
const ReactDOM = __importStar(require("react-dom"));
const React = __importStar(require("react"));
const ViewerTour_1 = require("./ViewerTour");
const LoadExampleDocs_1 = require("../repository/onboarding/LoadExampleDocs");
class ViewerTours {
    static createWhenNecessary(fingerprint) {
        if (fingerprint === LoadExampleDocs_1.LoadExampleDocs.MAIN_ANNOTATIONS_EXAMPLE_FINGERPRINT) {
            this.create();
        }
    }
    static create() {
        const id = 'viewer-tour-container';
        let container = document.getElementById(id);
        if (container) {
            return;
        }
        container = document.createElement('div');
        container.id = id;
        ReactDOM.render(React.createElement(ViewerTour_1.ViewerTour, null), container);
    }
}
exports.ViewerTours = ViewerTours;
//# sourceMappingURL=ViewerTours.js.map