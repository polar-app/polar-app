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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocFindButton = void 0;
const React = __importStar(require("react"));
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const Search_1 = __importDefault(require("@material-ui/icons/Search"));
const DocFindStore_1 = require("./DocFindStore");
exports.DocFindButton = React.memo((props) => {
    const { setActive } = DocFindStore_1.useDocFindCallbacks();
    return (React.createElement(IconButton_1.default, { className: props.className, onClick: () => setActive(true) },
        React.createElement(Search_1.default, null)));
});
//# sourceMappingURL=DocFindButton.js.map