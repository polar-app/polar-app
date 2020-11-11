"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ZestInjector = exports.useZest = void 0;
const AppRuntime_1 = require("polar-shared/src/util/AppRuntime");
const Platforms_1 = require("polar-shared/src/util/Platforms");
const Preconditions_1 = require("polar-shared/src/Preconditions");
const UserInfoProvider_1 = require("../apps/repository/auth_handler/UserInfoProvider");
function useZest() {
    const userInfoContext = UserInfoProvider_1.useUserInfoContext();
    const supported = ZestInjector.supportsZest();
    if (supported && !ZestInjector.hasZest() && (userInfoContext === null || userInfoContext === void 0 ? void 0 : userInfoContext.userInfo)) {
        ZestInjector.doInject({
            id: userInfoContext === null || userInfoContext === void 0 ? void 0 : userInfoContext.userInfo.uid,
            name: userInfoContext.userInfo.displayName || 'none',
            email: userInfoContext.userInfo.email
        });
    }
    const trigger = () => {
        ZestInjector.triggerZest();
    };
    return {
        supported,
        trigger
    };
}
exports.useZest = useZest;
var ZestInjector;
(function (ZestInjector) {
    let injected = false;
    function doInject(user) {
        if (injected) {
            return;
        }
        window.zestSettings = {
            app_id: "vft7zpk4",
            contact_name: user.name,
            contact_email: user.email,
            contact_id: user.id
        };
        const t = document.createElement("script");
        t.type = "text/javascript";
        t.async = !0;
        t.src = "https://hellozest.io/widget/" + window.zestSettings.app_id;
        document.body.appendChild(t);
        injected = true;
    }
    ZestInjector.doInject = doInject;
    function hasZest() {
        return Preconditions_1.isPresent(window.zestSettings);
    }
    ZestInjector.hasZest = hasZest;
    function triggerZest() {
        if (supportsZest()) {
            if (!window.zest.widget.opened()) {
                console.log("Opening Zest...");
                window.zest.widget.open();
            }
            else {
                console.log("Zest already opened");
            }
            return;
        }
        else {
            console.warn("Zest not supported");
        }
    }
    ZestInjector.triggerZest = triggerZest;
    function supportsZest() {
        if (!AppRuntime_1.AppRuntime.isBrowser()) {
            return false;
        }
        if (AppRuntime_1.AppRuntime.isElectron()) {
            return false;
        }
        if (!Platforms_1.Platforms.isDesktop()) {
            return false;
        }
        return true;
    }
    ZestInjector.supportsZest = supportsZest;
})(ZestInjector = exports.ZestInjector || (exports.ZestInjector = {}));
//# sourceMappingURL=ZestInjector.js.map