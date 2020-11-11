"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupportContent = void 0;
const react_1 = __importDefault(require("react"));
const NullCollapse_1 = require("../../../../web/js/ui/null_collapse/NullCollapse");
const MachineIDs_1 = require("polar-shared/src/util/MachineIDs");
const UserInfoProvider_1 = require("../../../../web/js/apps/repository/auth_handler/UserInfoProvider");
function SupportContent() {
    var _a;
    const userInfoContext = UserInfoProvider_1.useUserInfoContext();
    const plan = ((_a = userInfoContext === null || userInfoContext === void 0 ? void 0 : userInfoContext.userInfo) === null || _a === void 0 ? void 0 : _a.subscription.plan) || 'free';
    return (react_1.default.createElement("div", { className: "container" },
        react_1.default.createElement("div", { className: "row", id: "support" },
            react_1.default.createElement("div", { className: "col" },
                react_1.default.createElement("div", { className: "mb-3" },
                    react_1.default.createElement("h1", null, "Support Plans")),
                react_1.default.createElement(NullCollapse_1.NullCollapse, { open: plan === 'free' },
                    react_1.default.createElement("p", { className: "text-xl" }, "Polar has two main support options. Premium and Community."),
                    react_1.default.createElement("h2", null, "Premium"),
                    react_1.default.createElement("p", { className: "text-lg" },
                        "All users of ",
                        react_1.default.createElement("a", { href: "#plans" }, "Polar Premium"),
                        " benefit from direct support with 24 hour response time. This includes the ",
                        react_1.default.createElement("b", null, "bronze"),
                        ",",
                        react_1.default.createElement("b", null, "silver"),
                        ", and ",
                        react_1.default.createElement("b", null, "gold"),
                        " plans."),
                    react_1.default.createElement("p", { className: "text-lg" }, "Additionally, bug fixes and feature requests from premium users carry greater priority in our milestone planning."),
                    react_1.default.createElement("h2", null, "Community"),
                    react_1.default.createElement("p", { className: "text-lg" },
                        "Users on the free tier can use our community resources and reach out on ",
                        react_1.default.createElement("a", { href: "https://discord.gg/GT8MhA6" }, "Discord"),
                        " or ",
                        react_1.default.createElement("a", { href: "https://github.com/burtonator/polar-bookshelf/issues" }, "Create an issue on Github"),
                        "."),
                    react_1.default.createElement("p", { className: "text-lg" }, "We try our best to address your issues but obviously we focus on premium users first. Premium also means you take advantage of all the other features included there including cloud sync.")),
                react_1.default.createElement(NullCollapse_1.NullCollapse, { open: plan !== 'free' },
                    react_1.default.createElement("p", { className: "text-lg" },
                        "As a premium user on the ",
                        react_1.default.createElement("b", null, plan),
                        " you quality for premium support."),
                    react_1.default.createElement("p", { className: "text-lg" }, "You can contact support directly at:"),
                    react_1.default.createElement("h3", null,
                        react_1.default.createElement("b", null,
                            "support+",
                            MachineIDs_1.MachineIDs.get().substring(0, 5),
                            "@getpolarized.io")))))));
}
exports.SupportContent = SupportContent;
//# sourceMappingURL=SupportContent.js.map