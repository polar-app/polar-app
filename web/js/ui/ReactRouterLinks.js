"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactRouterLinks = void 0;
const Preconditions_1 = require("polar-shared/src/Preconditions");
function isRouterLinkObj(routerLink) {
    return Preconditions_1.isPresent(routerLink.pathname);
}
function toRouterLinkObj(routerLink) {
    if (isRouterLinkObj(routerLink)) {
        return routerLink;
    }
    return { pathname: routerLink, hash: '', search: '' };
}
var ILocations;
(function (ILocations) {
    function canonicalizeHash(hash) {
        if (!hash) {
            return "#";
        }
        if (!hash.startsWith("#")) {
            return "#" + hash;
        }
        return hash;
    }
    ILocations.canonicalizeHash = canonicalizeHash;
    function toString(location) {
        const hash = canonicalizeHash(location.hash);
        return `${location.pathname}${hash}`;
    }
    ILocations.toString = toString;
})(ILocations || (ILocations = {}));
var ReactRouterLinks;
(function (ReactRouterLinks) {
    function isActive(target, location = document.location) {
        const targetObj = toRouterLinkObj(target);
        const { pathname, hash } = targetObj;
        return location.pathname === pathname;
    }
    ReactRouterLinks.isActive = isActive;
})(ReactRouterLinks = exports.ReactRouterLinks || (exports.ReactRouterLinks = {}));
//# sourceMappingURL=ReactRouterLinks.js.map