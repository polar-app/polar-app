"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackButton2 = void 0;
const react_1 = __importDefault(require("react"));
const styles_1 = require("@material-ui/core/styles");
const Fab_1 = __importDefault(require("@material-ui/core/Fab"));
const DeviceRouter_1 = require("../../../../web/js/ui/DeviceRouter");
const MUIMenuItem_1 = require("../../../../web/js/mui/menu/MUIMenuItem");
const MUIMenuPopper_1 = require("../../../../web/js/mui/menu/MUIMenuPopper");
const Tooltip_1 = __importDefault(require("@material-ui/core/Tooltip"));
const ZestInjector_1 = require("../../../../web/js/zest/ZestInjector");
const LinkLoaderHook_1 = require("../../../../web/js/ui/util/LinkLoaderHook");
const UserInfoProvider_1 = require("../../../../web/js/apps/repository/auth_handler/UserInfoProvider");
const Plans_1 = require("polar-accounts/src/Plans");
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
const ActiveKeyboardShortcutsStore_1 = require("../../../../web/js/hotkeys/ActiveKeyboardShortcutsStore");
const MUIDialogControllers_1 = require("../../../../web/js/mui/dialogs/MUIDialogControllers");
const Functions_1 = require("polar-shared/src/util/Functions");
const VideoCall_1 = __importDefault(require("@material-ui/icons/VideoCall"));
const AllInbox_1 = __importDefault(require("@material-ui/icons/AllInbox"));
const Keyboard_1 = __importDefault(require("@material-ui/icons/Keyboard"));
const useStyles = styles_1.makeStyles((theme) => styles_1.createStyles({
    root: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(3),
    },
}));
function useReportFeedback() {
    const linkLoader = LinkLoaderHook_1.useLinkLoader();
    const userInfoContext = UserInfoProvider_1.useUserInfoContext();
    return react_1.default.useCallback(() => {
        var _a, _b, _c;
        const email = (_a = userInfoContext === null || userInfoContext === void 0 ? void 0 : userInfoContext.userInfo) === null || _a === void 0 ? void 0 : _a.email;
        if (!email) {
            return;
        }
        const plan = Plans_1.Plans.toV2((_b = userInfoContext === null || userInfoContext === void 0 ? void 0 : userInfoContext.userInfo) === null || _b === void 0 ? void 0 : _b.subscription.plan).level;
        const interval = ((_c = userInfoContext === null || userInfoContext === void 0 ? void 0 : userInfoContext.userInfo) === null || _c === void 0 ? void 0 : _c.subscription.interval) || 'monthly';
        const params = {
            email: encodeURIComponent(email),
            plan,
            interval
        };
        const url = `https://kevinburton1.typeform.com/to/lXUE4NmP#email=${params.email}&plan=${params.plan}&interval=${params.interval}`;
        linkLoader(url, { newWindow: true, focus: true });
    }, [linkLoader, userInfoContext]);
}
var MenuItems;
(function (MenuItems) {
    MenuItems.SendVideoFeedback = ReactUtils_1.deepMemo(() => {
        const zest = ZestInjector_1.useZest();
        const dialogs = MUIDialogControllers_1.useDialogManager();
        const handleClick = react_1.default.useCallback(() => {
            if (zest.supported) {
                zest.trigger();
            }
            else {
                dialogs.confirm({
                    title: "Video Feedback Not Support",
                    subtitle: "Video feedback is not supported on this platform. Please use our web application to send video feedback.",
                    type: 'error',
                    onAccept: Functions_1.NULL_FUNCTION
                });
            }
        }, [dialogs, zest]);
        return (react_1.default.createElement(MUIMenuItem_1.MUIMenuItem, { text: "Send Video Feedback", icon: react_1.default.createElement(VideoCall_1.default, null), onClick: handleClick }));
    });
    MenuItems.RequestFeatures = ReactUtils_1.deepMemo(() => {
        const reportFeedback = useReportFeedback();
        return (react_1.default.createElement(MUIMenuItem_1.MUIMenuItem, { text: "Request Features and Help Improve Polar", icon: react_1.default.createElement(AllInbox_1.default, null), onClick: reportFeedback }));
    });
    MenuItems.ShowActiveKeyboardShortcuts = ReactUtils_1.deepMemo(() => {
        const { setShowActiveShortcuts } = ActiveKeyboardShortcutsStore_1.useActiveKeyboardShortcutsCallbacks();
        return (react_1.default.createElement(MUIMenuItem_1.MUIMenuItem, { text: "Show Active Keyboard Shortcuts", icon: react_1.default.createElement(Keyboard_1.default, null), onClick: () => setShowActiveShortcuts(true) }));
    });
})(MenuItems || (MenuItems = {}));
function FeedbackButton2() {
    const classes = useStyles();
    const [open, setOpen] = react_1.default.useState(false);
    const [tooltipActive, setTooltipActive] = react_1.default.useState(false);
    const anchorRef = react_1.default.useRef(null);
    const handleClick = react_1.default.useCallback(() => {
        setOpen(!open);
    }, [open]);
    return (react_1.default.createElement(DeviceRouter_1.DeviceRouters.Desktop, null,
        react_1.default.createElement(react_1.default.Fragment, null,
            react_1.default.createElement(Tooltip_1.default, { open: tooltipActive && !open, placement: "left", title: "Feedback and Resources." },
                react_1.default.createElement(Fab_1.default, { ref: anchorRef, style: {
                        zIndex: 1000
                    }, color: "primary", "aria-label": "Feedback", onClick: handleClick, onMouseEnter: () => setTooltipActive(true), onMouseLeave: () => setTooltipActive(false), className: classes.root },
                    react_1.default.createElement("div", { style: {
                            fontSize: '28px',
                            lineHeight: '28px'
                        } }, "?"))),
            react_1.default.createElement(MUIMenuPopper_1.MUIMenuPopper, { anchorRef: anchorRef, placement: "bottom-end", open: open, onClosed: () => setOpen(false) },
                react_1.default.createElement("div", null,
                    react_1.default.createElement(MenuItems.SendVideoFeedback, null),
                    react_1.default.createElement(MenuItems.RequestFeatures, null),
                    react_1.default.createElement(MenuItems.ShowActiveKeyboardShortcuts, null))))));
}
exports.FeedbackButton2 = FeedbackButton2;
//# sourceMappingURL=FeedbackButton2.js.map