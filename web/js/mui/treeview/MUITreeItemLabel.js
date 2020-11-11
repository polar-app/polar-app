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
exports.MUITreeItemLabel = void 0;
const react_1 = __importStar(require("react"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const core_1 = require("@material-ui/core");
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const MUIEfficientCheckbox_1 = require("../../../../apps/repository/js/folders/MUIEfficientCheckbox");
const styles_1 = require("@material-ui/core/styles");
const clsx_1 = __importDefault(require("clsx"));
const DragTarget2_1 = require("../../ui/tree/DragTarget2");
const MUIContextMenu_1 = require("../../../../apps/repository/js/doc_repo/MUIContextMenu");
const useStyles = makeStyles_1.default((theme) => core_1.createStyles({
    root: {
        userSelect: 'none',
        fontSize: '1.1rem',
        display: "flex",
        alignItems: "center",
        paddingTop: '7px',
        paddingBottom: '7px',
        cursor: 'pointer',
        '&:hover': {
            background: theme.palette.action.hover
        },
        '&$selected, &$selected:hover': {
            backgroundColor: styles_1.fade(theme.palette.secondary.main, theme.palette.action.selectedOpacity),
        },
        '&$drag, &$drag:hover': {
            backgroundColor: theme.palette.primary.light,
            color: theme.palette.primary.contrastText,
        },
    },
    label: {
        paddingLeft: '5px',
        flexGrow: 1,
    },
    info: {
        color: theme.palette.text.hint,
        paddingRight: '5px',
    },
    checkbox: {
        display: "flex",
        alignItems: "center",
        color: theme.palette.text.secondary,
    },
    selected: {},
    drag: {},
}));
exports.MUITreeItemLabel = react_1.default.memo((props) => {
    const classes = useStyles();
    const drag = DragTarget2_1.useDragContext();
    const contextMenuCallbacks = MUIContextMenu_1.useContextMenu();
    const onCheckbox = react_1.useCallback((event) => {
        props.selectRow(props.nodeId, event, 'checkbox');
        event.stopPropagation();
    }, [props]);
    const className = clsx_1.default(classes.root, {
        [classes.selected]: props.selected,
        [classes.drag]: drag.active,
    });
    return (react_1.default.createElement("div", Object.assign({ className: className }, contextMenuCallbacks, { onClick: event => props.selectRow(props.nodeId, event, 'click') }),
        react_1.default.createElement("div", { className: classes.checkbox, onClick: event => onCheckbox(event) },
            react_1.default.createElement(MUIEfficientCheckbox_1.MUIEfficientCheckbox, { checked: props.selected })),
        react_1.default.createElement("div", { className: classes.label }, props.label),
        react_1.default.createElement("div", { className: classes.info }, props.info)));
}, react_fast_compare_1.default);
//# sourceMappingURL=MUITreeItemLabel.js.map