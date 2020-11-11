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
exports.SideNavButtonWithIcon = void 0;
const React = __importStar(require("react"));
const SideNavStore_1 = require("./SideNavStore");
const ReactUtils_1 = require("../react/ReactUtils");
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const createStyles_1 = __importDefault(require("@material-ui/core/styles/createStyles"));
const clsx_1 = __importDefault(require("clsx"));
const MUIFontAwesome_1 = require("../mui/MUIFontAwesome");
const WIDTH = 72;
const BORDER = 3;
const useStyles = makeStyles_1.default((theme) => createStyles_1.default({
    button: {
        width: `${WIDTH - (BORDER * 2)}px`,
        borderLeftWidth: `${BORDER}`,
        borderLeftStyle: 'solid',
        borderLeftColor: 'transparent',
        borderRightWidth: `${BORDER}`,
        borderRightStyle: 'solid',
        borderRightColor: 'transparent',
        marginBottom: '5px',
        cursor: 'pointer',
        "& img": {
            width: `${WIDTH - (BORDER * 2)}px`,
            borderRadius: '5px',
        },
        '&:hover': {
            borderLeftColor: theme.palette.secondary.main
        },
    },
    activeButton: {
        borderLeftColor: theme.palette.secondary.main
    },
}));
exports.SideNavButtonWithIcon = ReactUtils_1.deepMemo((props) => {
    const { tab } = props;
    const { activeTab } = SideNavStore_1.useSideNavStore(['tabs', 'activeTab']);
    const { setActiveTab } = SideNavStore_1.useSideNavCallbacks();
    const classes = useStyles();
    const active = tab.id === activeTab;
    return (React.createElement("div", null,
        React.createElement("div", { onClick: () => setActiveTab(tab.id), className: clsx_1.default(classes.button, active && classes.activeButton) },
            React.createElement(MUIFontAwesome_1.FAFileIcon, null))));
});
//# sourceMappingURL=SideNavButtonWithIcon.js.map