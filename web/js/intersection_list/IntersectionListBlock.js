"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LazyBlockComponent = exports.IntersectionListBlock = exports.useIntersectionObserverUsingCalculationViewState = void 0;
const React = __importStar(require("react"));
const react_intersection_observer_1 = require("react-intersection-observer");
const IntersectionListBlockItem_1 = require("./IntersectionListBlockItem");
const ReactHooks_1 = require("../hooks/ReactHooks");
function useIntersectionObserverViewState(opts) {
    const { root } = opts;
    const [inView, setUseInView] = React.useState(false);
    const observation = react_intersection_observer_1.useInView({
        threshold: 0,
        trackVisibility: true,
        delay: 100,
        root
    });
    if (observation.inView && !inView) {
        setUseInView(true);
    }
    return {
        ref: observation.ref,
        inView
    };
}
function useIntersectionObserverUsingCalculationViewState(opts) {
    const { ref, inView, entry } = react_intersection_observer_1.useInView({
        threshold: 0,
        trackVisibility: true,
        delay: 100,
        root: opts.root
    });
}
exports.useIntersectionObserverUsingCalculationViewState = useIntersectionObserverUsingCalculationViewState;
exports.IntersectionListBlock = ReactHooks_1.typedMemo(function (props) {
    const { ref, inView } = useIntersectionObserverViewState(props);
    return (React.createElement(exports.LazyBlockComponent, { innerRef: ref, inView: inView, values: props.values, visibleComponent: props.visibleComponent, blockComponent: props.blockComponent, hiddenComponent: props.hiddenComponent, blockSize: props.blockSize, blockIndex: props.blockIndex, root: props.root }));
});
exports.LazyBlockComponent = ReactHooks_1.typedMemo(function (props) {
    const BlockComponent = props.blockComponent;
    const indexBase = props.blockIndex * props.blockSize;
    return (React.createElement(BlockComponent, { innerRef: props.innerRef, values: props.values },
        React.createElement(React.Fragment, null, props.values.map((current, index) => (React.createElement(IntersectionListBlockItem_1.IntersectionListBlockItem, { key: indexBase + index, root: props.root, value: current, index: indexBase + index, visibleComponent: props.visibleComponent, hiddenComponent: props.hiddenComponent, inView: props.inView }))))));
});
//# sourceMappingURL=IntersectionListBlock.js.map