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
exports.SideNav = void 0;
const React = __importStar(require("react"));
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const createStyles_1 = __importDefault(require("@material-ui/core/styles/createStyles"));
const SideNavStore_1 = require("./SideNavStore");
const Divider_1 = __importDefault(require("@material-ui/core/Divider"));
const PolarSVGIcon_1 = require("../ui/svg_icons/PolarSVGIcon");
const SideNavButtonWithIcon_1 = require("./SideNavButtonWithIcon");
const MUIFontAwesome_1 = require("../mui/MUIFontAwesome");
const react_router_dom_1 = require("react-router-dom");
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const WIDTH = 72;
const useStyles = makeStyles_1.default((theme) => createStyles_1.default({
    root: {
        display: 'flex',
        flexDirection: 'column',
        width: `${WIDTH}px`,
        backgroundColor: theme.palette.background.default
    },
    logo: {
        display: 'flex',
        "& *": {
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    divider: {
        marginBottom: '5px',
        padding: theme.spacing(1)
    },
    buttons: {
        flexGrow: 1,
        minHeight: 0,
        overflow: 'hidden'
    }
}));
const HomeButton = () => {
    const history = react_router_dom_1.useHistory();
    return (React.createElement(IconButton_1.default, { onClick: () => history.push('/') },
        React.createElement(MUIFontAwesome_1.FAHomeIcon, null)));
};
exports.SideNav = React.memo(() => {
    const classes = useStyles();
    const { tabs } = SideNavStore_1.useSideNavStore(['tabs']);
    const toNavButton = React.useCallback((tab) => {
        return (React.createElement(SideNavButtonWithIcon_1.SideNavButtonWithIcon, { key: tab.id, tab: tab }));
    }, []);
    return (React.createElement("div", { className: classes.root },
        React.createElement("div", { className: classes.logo },
            React.createElement(PolarSVGIcon_1.PolarSVGIcon, { width: WIDTH - 4, height: WIDTH - 4 })),
        React.createElement("div", { className: classes.divider },
            React.createElement(Divider_1.default, null)),
        React.createElement(HomeButton, null),
        React.createElement("div", { className: classes.divider },
            React.createElement(Divider_1.default, null)),
        React.createElement("div", { className: classes.buttons }, tabs.map(toNavButton))));
});
//# sourceMappingURL=SideNav.js.map