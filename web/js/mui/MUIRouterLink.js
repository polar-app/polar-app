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
exports.MUIRouterLink = void 0;
const React = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const styles_1 = require("@material-ui/core/styles");
const useStyles = styles_1.makeStyles((theme) => styles_1.createStyles({
    link: {
        textDecoration: 'none',
        color: theme.palette.text.primary
    }
}));
exports.MUIRouterLink = React.memo((props) => {
    const classes = useStyles();
    return (React.createElement(react_router_dom_1.Link, { id: props.id, className: [props.className, classes.link].join(' '), to: props.to }, props.children));
}, react_fast_compare_1.default);
//# sourceMappingURL=MUIRouterLink.js.map