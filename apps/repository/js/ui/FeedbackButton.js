"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FeedbackButton = void 0;
const react_1 = __importDefault(require("react"));
const styles_1 = require("@material-ui/core/styles");
const Fab_1 = __importDefault(require("@material-ui/core/Fab"));
const ChatBubble_1 = __importDefault(require("@material-ui/icons/ChatBubble"));
const LinkLoaderHook_1 = require("../../../../web/js/ui/util/LinkLoaderHook");
const DeviceRouter_1 = require("../../../../web/js/ui/DeviceRouter");
const UserInfoProvider_1 = require("../../../../web/js/apps/repository/auth_handler/UserInfoProvider");
const Plans_1 = require("polar-accounts/src/Plans");
const MUITooltip_1 = require("../../../../web/js/mui/MUITooltip");
const useStyles = styles_1.makeStyles((theme) => styles_1.createStyles({
    root: {
        position: 'absolute',
        bottom: theme.spacing(2),
        right: theme.spacing(3),
    },
}));
function FeedbackButton() {
    const classes = useStyles();
    const linkLoader = LinkLoaderHook_1.useLinkLoader();
    const userInfoContext = UserInfoProvider_1.useUserInfoContext();
    const handleFeedback = react_1.default.useCallback(() => {
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
    return (react_1.default.createElement(DeviceRouter_1.DeviceRouters.Desktop, null,
        react_1.default.createElement(MUITooltip_1.MUITooltip, { title: "Send us feedback to help improve Polar." },
            react_1.default.createElement(Fab_1.default, { color: "primary", "aria-label": "Feedback", onClick: handleFeedback, className: classes.root },
                react_1.default.createElement(ChatBubble_1.default, null)))));
}
exports.FeedbackButton = FeedbackButton;
//# sourceMappingURL=FeedbackButton.js.map