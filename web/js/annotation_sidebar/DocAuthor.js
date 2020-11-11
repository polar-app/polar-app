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
exports.DocAuthor = void 0;
const React = __importStar(require("react"));
const UserAvatar_1 = require("../ui/cloud_auth/UserAvatar");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
exports.DocAuthor = React.memo((props) => {
    var _a, _b, _c;
    const { author } = props;
    if (author && author.image) {
        return React.createElement(UserAvatar_1.UserAvatar, { photoURL: (_b = (_a = props.author) === null || _a === void 0 ? void 0 : _a.image) === null || _b === void 0 ? void 0 : _b.src, displayName: (_c = props.author) === null || _c === void 0 ? void 0 : _c.name });
    }
    else {
        return null;
    }
}, react_fast_compare_1.default);
//# sourceMappingURL=DocAuthor.js.map