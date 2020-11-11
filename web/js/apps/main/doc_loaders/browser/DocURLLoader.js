"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDocURLLoader = exports.DocURLLoader = void 0;
const Nav_1 = require("../../../../ui/util/Nav");
const LinkLoaderHook_1 = require("../../../../ui/util/LinkLoaderHook");
var DocURLLoader;
(function (DocURLLoader) {
    function create() {
        const linkLoader = Nav_1.Nav.createLinkLoader({ focus: true, newWindow: true });
        return (url) => {
            linkLoader.load(url);
        };
    }
    DocURLLoader.create = create;
})(DocURLLoader = exports.DocURLLoader || (exports.DocURLLoader = {}));
function useDocURLLoader() {
    const linkLoader = LinkLoaderHook_1.useLinkLoader();
    const opts = { focus: true, newWindow: true };
    return (url) => {
        linkLoader(url, opts);
    };
}
exports.useDocURLLoader = useDocURLLoader;
//# sourceMappingURL=DocURLLoader.js.map