"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importDefault(require("react"));
const styles_1 = require("@material-ui/core/styles");
const TreeView_1 = __importDefault(require("@material-ui/lab/TreeView"));
const TreeItem_1 = __importDefault(require("@material-ui/lab/TreeItem"));
const Typography_1 = __importDefault(require("@material-ui/core/Typography"));
const Mail_1 = __importDefault(require("@material-ui/icons/Mail"));
const Delete_1 = __importDefault(require("@material-ui/icons/Delete"));
const Label_1 = __importDefault(require("@material-ui/icons/Label"));
const SupervisorAccount_1 = __importDefault(require("@material-ui/icons/SupervisorAccount"));
const Info_1 = __importDefault(require("@material-ui/icons/Info"));
const Forum_1 = __importDefault(require("@material-ui/icons/Forum"));
const LocalOffer_1 = __importDefault(require("@material-ui/icons/LocalOffer"));
const ArrowDropDown_1 = __importDefault(require("@material-ui/icons/ArrowDropDown"));
const ArrowRight_1 = __importDefault(require("@material-ui/icons/ArrowRight"));
const useTreeItemStyles = styles_1.makeStyles((theme) => ({
    root: {
        color: theme.palette.text.secondary,
        '&:hover > $content': {
            backgroundColor: theme.palette.action.hover,
        },
        '&:focus > $content, &$selected > $content': {
            backgroundColor: `var(--tree-view-bg-color, ${theme.palette.grey[400]})`,
            color: 'var(--tree-view-color)',
        },
        '&:focus > $content $label, &:hover > $content $label, &$selected > $content $label': {
            backgroundColor: 'transparent',
        },
    },
    content: {
        color: theme.palette.text.secondary,
        borderTopRightRadius: theme.spacing(2),
        borderBottomRightRadius: theme.spacing(2),
        paddingRight: theme.spacing(1),
        fontWeight: theme.typography.fontWeightMedium,
        '$expanded > &': {
            fontWeight: theme.typography.fontWeightRegular,
        },
    },
    group: {
        marginLeft: 0,
        '& $content': {
            paddingLeft: theme.spacing(2),
        },
    },
    expanded: {},
    selected: {},
    label: {
        fontWeight: 'inherit',
        color: 'inherit',
    },
    labelRoot: {
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0.5, 0),
    },
    labelIcon: {
        marginRight: theme.spacing(1),
    },
    labelText: {
        fontWeight: 'inherit',
        flexGrow: 1,
    },
}));
function StyledTreeItem(props) {
    const classes = useTreeItemStyles();
    const { labelText, labelIcon: LabelIcon, labelInfo, color, bgColor } = props, other = __rest(props, ["labelText", "labelIcon", "labelInfo", "color", "bgColor"]);
    return (react_1.default.createElement(TreeItem_1.default, Object.assign({ label: react_1.default.createElement("div", { className: classes.labelRoot },
            react_1.default.createElement(LabelIcon, { color: "inherit", className: classes.labelIcon }),
            react_1.default.createElement(Typography_1.default, { variant: "body2", className: classes.labelText }, labelText),
            react_1.default.createElement(Typography_1.default, { variant: "caption", color: "inherit" }, labelInfo)), style: {
            '--tree-view-color': color,
            '--tree-view-bg-color': bgColor,
        }, classes: {
            root: classes.root,
            content: classes.content,
            expanded: classes.expanded,
            selected: classes.selected,
            group: classes.group,
            label: classes.label,
        } }, other)));
}
const useStyles = styles_1.makeStyles({
    root: {
        height: 264,
        flexGrow: 1,
        maxWidth: 400,
    },
});
function TreeControl() {
    const classes = useStyles();
    return (react_1.default.createElement(TreeView_1.default, { className: classes.root, defaultExpanded: ['3'], defaultCollapseIcon: react_1.default.createElement(ArrowDropDown_1.default, null), defaultExpandIcon: react_1.default.createElement(ArrowRight_1.default, null), defaultEndIcon: react_1.default.createElement("div", { style: { width: 24 } }) },
        react_1.default.createElement(StyledTreeItem, { labelText: "All Mail", labelIcon: Mail_1.default }),
        react_1.default.createElement(StyledTreeItem, { labelText: "Trash", labelIcon: Delete_1.default }),
        react_1.default.createElement(StyledTreeItem, { labelText: "Categories", labelIcon: Label_1.default },
            react_1.default.createElement(StyledTreeItem, { labelText: "Social", labelIcon: SupervisorAccount_1.default, labelInfo: "90", color: "#1a73e8", bgColor: "#e8f0fe" }),
            react_1.default.createElement(StyledTreeItem, { labelText: "Updates", labelIcon: Info_1.default, labelInfo: "2,294", color: "#e3742f", bgColor: "#fcefe3" }),
            react_1.default.createElement(StyledTreeItem, { labelText: "Forums", labelIcon: Forum_1.default, labelInfo: "3,566", color: "#a250f5", bgColor: "#f3e8fd" }),
            react_1.default.createElement(StyledTreeItem, { labelText: "Promotions", labelIcon: LocalOffer_1.default, labelInfo: "733", color: "#3c8039", bgColor: "#e6f4ea" })),
        react_1.default.createElement(StyledTreeItem, { labelText: "History", labelIcon: Label_1.default })));
}
exports.default = TreeControl;
//# sourceMappingURL=TreeControl.js.map