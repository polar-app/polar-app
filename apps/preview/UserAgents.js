"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserAgents = void 0;
var UserAgents;
(function (UserAgents) {
    function isPrerender() {
        const text = 'Prerender (+https://github.com/prerender/prerender)';
        return navigator.userAgent && navigator.userAgent.indexOf(text) !== -1;
    }
    UserAgents.isPrerender = isPrerender;
})(UserAgents = exports.UserAgents || (exports.UserAgents = {}));
//# sourceMappingURL=UserAgents.js.map