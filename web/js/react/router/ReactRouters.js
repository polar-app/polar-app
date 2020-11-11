"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ReactRouters = void 0;
const react_router_dom_1 = require("react-router-dom");
var ReactRouters;
(function (ReactRouters) {
    function createLocationWithPathAndHash() {
        const computePathname = () => {
            return document.location.hash ?
                document.location.pathname + '' + document.location.hash : document.location.pathname;
        };
        return {
            get pathname() {
                return computePathname();
            },
            get search() {
                return document.location.search;
            },
            get hash() {
                return document.location.hash;
            },
            state: null,
        };
    }
    ReactRouters.createLocationWithPathAndHash = createLocationWithPathAndHash;
    function createLocationWithPathOnly() {
        return {
            get pathname() {
                return document.location.pathname;
            },
            get search() {
                return "";
            },
            get hash() {
                return "";
            },
            state: null,
        };
    }
    ReactRouters.createLocationWithPathOnly = createLocationWithPathOnly;
    function useLocationWithPathOnly() {
        const location = react_router_dom_1.useLocation();
        return {
            get pathname() {
                return location.pathname;
            },
            get search() {
                return "";
            },
            get hash() {
                return "";
            },
            state: null,
        };
    }
    ReactRouters.useLocationWithPathOnly = useLocationWithPathOnly;
    function createLocationWithHashOnly(location = document.location) {
        return {
            get pathname() {
                return location.hash;
            },
            get search() {
                return location.hash;
            },
            get hash() {
                return location.hash;
            },
            state: null,
        };
    }
    ReactRouters.createLocationWithHashOnly = createLocationWithHashOnly;
    function useLocationWithHashOnly() {
        const location = react_router_dom_1.useLocation();
        return {
            get pathname() {
                return location.hash;
            },
            get search() {
                return location.hash;
            },
            get hash() {
                return location.hash;
            },
            state: null,
        };
    }
    ReactRouters.useLocationWithHashOnly = useLocationWithHashOnly;
})(ReactRouters = exports.ReactRouters || (exports.ReactRouters = {}));
//# sourceMappingURL=ReactRouters.js.map