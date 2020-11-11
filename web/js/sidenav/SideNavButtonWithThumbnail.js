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
exports.SideNavButtonWithThumbnail = void 0;
const React = __importStar(require("react"));
const SideNavStore_1 = require("./SideNavStore");
const ReactUtils_1 = require("../react/ReactUtils");
const CardActionArea_1 = __importDefault(require("@material-ui/core/CardActionArea"));
const Card_1 = __importDefault(require("@material-ui/core/Card"));
const CardMedia_1 = __importDefault(require("@material-ui/core/CardMedia"));
const CardContent_1 = __importDefault(require("@material-ui/core/CardContent"));
const Typography_1 = __importDefault(require("@material-ui/core/Typography"));
const Tooltip_1 = __importDefault(require("@material-ui/core/Tooltip"));
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const createStyles_1 = __importDefault(require("@material-ui/core/styles/createStyles"));
const clsx_1 = __importDefault(require("clsx"));
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
    logo: {
        display: 'flex',
        "& *": {
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    divider: {
        marginBottom: '5px',
    }
}));
exports.SideNavButtonWithThumbnail = ReactUtils_1.deepMemo((props) => {
    const { tab } = props;
    const { activeTab } = SideNavStore_1.useSideNavStore(['tabs', 'activeTab']);
    const { setActiveTab } = SideNavStore_1.useSideNavCallbacks();
    const classes = useStyles();
    const active = tab.id === activeTab;
    const Title = () => {
        var _a;
        return (React.createElement(Card_1.default, null,
            React.createElement(CardActionArea_1.default, null,
                React.createElement(CardMedia_1.default, { component: "img", alt: tab.title, height: "200", style: {
                        objectPosition: "0% 0%"
                    }, image: (_a = tab.image) === null || _a === void 0 ? void 0 : _a.url, title: tab.title }),
                React.createElement(CardContent_1.default, null,
                    React.createElement(Typography_1.default, { gutterBottom: true, variant: "h5", component: "h2" }, tab.title),
                    React.createElement(Typography_1.default, { variant: "body2", color: "textSecondary", component: "p" }, "Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging across all continents except Antarctica")))));
    };
    return (React.createElement("div", null,
        React.createElement(Tooltip_1.default, { placement: "right", enterDelay: 0, leaveDelay: 0, arrow: true, PopperProps: {
                style: {
                    display: active ? 'none' : undefined
                }
            }, title: React.createElement(Title, null) },
            React.createElement("div", { onClick: () => setActiveTab(tab.id), className: clsx_1.default(classes.button, active && classes.activeButton) }, tab.icon))));
});
//# sourceMappingURL=SideNavButtonWithThumbnail.js.map