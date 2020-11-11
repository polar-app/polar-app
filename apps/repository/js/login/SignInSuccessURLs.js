"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SignInSuccessURLs = void 0;
const Optional_1 = require("polar-shared/src/util/ts/Optional");
const URLs_1 = require("polar-shared/src/util/URLs");
const AppRuntime_1 = require("polar-shared/src/util/AppRuntime");
var SignInSuccessURLs;
(function (SignInSuccessURLs) {
    function get() {
        return Optional_1.Optional.first(getCustom(), getDefault()).get();
    }
    SignInSuccessURLs.get = get;
    function createSignInURL(signInSuccessUrl, baseURL) {
        var _a;
        if (baseURL === void 0) { baseURL = (_a = document.location) === null || _a === void 0 ? void 0 : _a.href; }
        if (!signInSuccessUrl || signInSuccessUrl.indexOf('/login') !== -1) {
            return baseURL;
        }
        return baseURL + "?signInSuccessUrl=" + encodeURIComponent(signInSuccessUrl);
    }
    SignInSuccessURLs.createSignInURL = createSignInURL;
    function getCustom() {
        const url = new URL(document.location.href);
        return Optional_1.Optional.of(url.searchParams.get('signInSuccessUrl'))
            .getOrUndefined();
    }
    function getDefault() {
        const base = URLs_1.URLs.toBase(document.location.href);
        const signInPath = AppRuntime_1.AppRuntime.isBrowser() ? "/" : '/#configured';
        return new URL(signInPath, base).toString();
    }
})(SignInSuccessURLs = exports.SignInSuccessURLs || (exports.SignInSuccessURLs = {}));
//# sourceMappingURL=SignInSuccessURLs.js.map