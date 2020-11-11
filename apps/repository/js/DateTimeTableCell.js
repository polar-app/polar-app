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
exports.DateTimeTableCell = void 0;
const React = __importStar(require("react"));
const Preconditions_1 = require("polar-shared/src/Preconditions");
const react_moment_1 = __importDefault(require("react-moment"));
exports.DateTimeTableCell = React.memo((props) => {
    if (Preconditions_1.isPresent(props.datetime)) {
        return (React.createElement(react_moment_1.default, { withTitle: true, className: props.className || '', style: Object.assign({ whiteSpace: 'nowrap', userSelect: "none" }, props.style), titleFormat: "D MMM YYYY hh:MM A", fromNow: true, ago: true }, props.datetime));
    }
    else {
        return null;
    }
});
//# sourceMappingURL=DateTimeTableCell.js.map