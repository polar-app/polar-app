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
exports.ReviewerDialog = void 0;
const React = __importStar(require("react"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const AppBar_1 = __importDefault(require("@material-ui/core/AppBar"));
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const Typography_1 = __importDefault(require("@material-ui/core/Typography"));
const Close_1 = __importDefault(require("@material-ui/icons/Close"));
const Toolbar_1 = __importDefault(require("@material-ui/core/Toolbar"));
const Slide_1 = __importDefault(require("@material-ui/core/Slide"));
const PolarSVGIcon_1 = require("../../../../web/js/ui/svg_icons/PolarSVGIcon");
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const Dialog_1 = __importDefault(require("@material-ui/core/Dialog"));
const react_1 = require("react");
const react_router_dom_1 = require("react-router-dom");
const ReviewerStore_1 = require("./ReviewerStore");
const useStyles = makeStyles_1.default((theme) => ({
    appBar: {
        position: 'relative',
    },
    title: {
        marginLeft: theme.spacing(2),
        flex: 1,
    },
}));
const Transition = React.forwardRef(function Transition(props, ref) {
    return React.createElement(Slide_1.default, Object.assign({ direction: "up", ref: ref }, props));
});
exports.ReviewerDialog = React.memo((props) => {
    const classes = useStyles();
    const [open, setOpen] = react_1.useState(true);
    const history = react_router_dom_1.useHistory();
    const { onSuspended } = ReviewerStore_1.useReviewerCallbacks();
    const handleClose = React.useCallback(() => {
        setOpen(false);
        onSuspended();
        history.replace({ pathname: "/annotations", hash: "" });
    }, [history, onSuspended]);
    return (React.createElement(Dialog_1.default, { fullScreen: true, open: open, TransitionComponent: Transition },
        React.createElement(React.Fragment, null,
            React.createElement(AppBar_1.default, { className: classes.appBar, color: "inherit" },
                React.createElement(Toolbar_1.default, null,
                    React.createElement(PolarSVGIcon_1.PolarSVGIcon, { width: 64, height: 64 }),
                    React.createElement(Typography_1.default, { variant: "h6", className: classes.title }, "Review"),
                    React.createElement(IconButton_1.default, { edge: "start", color: "inherit", onClick: handleClose, "aria-label": "close" },
                        React.createElement(Close_1.default, null)))),
            props.children)));
}, react_fast_compare_1.default);
//# sourceMappingURL=ReviewerDialog.js.map