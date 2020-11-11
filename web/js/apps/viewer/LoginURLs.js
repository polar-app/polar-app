"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoginURLs = void 0;
class LoginURLs {
    static create(signInSuccessUrl) {
        if (signInSuccessUrl) {
            return '/login.html?signInSuccessUrl=' + encodeURIComponent(signInSuccessUrl);
        }
        else {
            return '/login.html';
        }
    }
}
exports.LoginURLs = LoginURLs;
//# sourceMappingURL=LoginURLs.js.map