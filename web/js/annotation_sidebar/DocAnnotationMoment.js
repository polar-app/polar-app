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
exports.DocAnnotationMoment = void 0;
const React = __importStar(require("react"));
const react_moment_1 = __importDefault(require("react-moment"));
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const core_1 = require("@material-ui/core");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const useStyles = makeStyles_1.default((theme) => core_1.createStyles({
    root: {
        marginTop: 'auto',
        marginBottom: 'auto',
        color: theme.palette.text.secondary,
        whiteSpace: 'nowrap'
    },
}));
exports.DocAnnotationMoment = React.memo((props) => {
    const classes = useStyles();
    return (React.createElement("div", { className: classes.root },
        React.createElement(react_moment_1.default, { style: {
                fontSize: '12px'
            }, withTitle: true, titleFormat: "D MMM YYYY hh:MM A", fromNow: true }, props.created)));
}, react_fast_compare_1.default);
//# sourceMappingURL=DocAnnotationMoment.js.map