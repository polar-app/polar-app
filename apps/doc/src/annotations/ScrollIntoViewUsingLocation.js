"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useScrollTargetUpdateListener = exports.useScrollTarget = exports.ScrollTargets = exports.useScrollIntoViewUsingLocation = exports.scrollIntoView = void 0;
const react_1 = __importDefault(require("react"));
const HashURLs_1 = require("polar-shared/src/util/HashURLs");
const UseLocationChangeStore_1 = require("./UseLocationChangeStore");
const react_router_dom_1 = require("react-router-dom");
const Optional_1 = require("polar-shared/src/util/ts/Optional");
function scrollIntoView(scrollTarget, ref) {
    const alignToTop = scrollTarget.pos === 'top';
    ref.scrollIntoView(alignToTop);
}
exports.scrollIntoView = scrollIntoView;
function useScrollIntoViewUsingLocation() {
    const ref = react_1.default.useRef(null);
    const { initialScrollLoader } = UseLocationChangeStore_1.useLocationChangeStore(['initialScrollLoader']);
    const scrollTarget = useScrollTarget();
    function handleRef() {
        if (scrollTarget && ref.current) {
            initialScrollLoader(scrollTarget, ref.current);
        }
    }
    handleRef();
    return (newRef) => {
        if (ref.current !== newRef) {
            ref.current = newRef;
            handleRef();
        }
    };
}
exports.useScrollIntoViewUsingLocation = useScrollIntoViewUsingLocation;
var ScrollTargets;
(function (ScrollTargets) {
    function parse(queryOrLocation) {
        const params = HashURLs_1.HashURLs.parse(queryOrLocation);
        const target = params.get('target') || undefined;
        const n = params.get('n');
        const b = Optional_1.Optional.of(params.get('b'))
            .map(parseInt)
            .getOrElse(0);
        const pos = params.get('pos') === 'bottom' ? 'bottom' : 'top';
        if (!n) {
            return undefined;
        }
        if (!target) {
            return undefined;
        }
        return { target, pos, n, b };
    }
    ScrollTargets.parse = parse;
})(ScrollTargets = exports.ScrollTargets || (exports.ScrollTargets = {}));
function useScrollTarget() {
    const location = react_router_dom_1.useLocation();
    return ScrollTargets.parse(location);
}
exports.useScrollTarget = useScrollTarget;
function useScrollTargetUpdateListener() {
    const history = react_router_dom_1.useHistory();
    function listen(listener) {
        return history.listen(newLocation => {
            const scrollTarget = ScrollTargets.parse(newLocation);
            if (scrollTarget) {
                listener(scrollTarget);
            }
        });
    }
    return { listen };
}
exports.useScrollTargetUpdateListener = useScrollTargetUpdateListener;
//# sourceMappingURL=ScrollIntoViewUsingLocation.js.map