"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ComponentProgressLoader = void 0;
const react_1 = __importDefault(require("react"));
const LinearProgress_1 = __importDefault(require("@material-ui/core/LinearProgress"));
const ComponentProgressLoaderContext = react_1.default.createContext(null);
function useComponentProgressLoader() {
    return react_1.default.useContext(ComponentProgressLoaderContext);
}
const LoadingBar = () => {
    return (react_1.default.createElement(LinearProgress_1.default, { style: {
            position: 'absolute',
            left: 0,
            top: 0,
            height: 1,
            width: '100%',
            zIndex: 20000
        } }));
};
const StartLoading = () => {
    const loader = useComponentProgressLoader();
    react_1.default.useEffect(() => {
        loader.setLoading(true);
    }, [loader]);
    return null;
};
const EndLoading = () => {
    const loader = useComponentProgressLoader();
    react_1.default.useEffect(() => {
        loader.setLoading(false);
    }, [loader]);
    return null;
};
exports.ComponentProgressLoader = react_1.default.memo((props) => {
    const [loading, setLoading] = react_1.default.useState(false);
    const context = react_1.default.useMemo(() => ({
        setLoading
    }), [setLoading]);
    return (react_1.default.createElement(ComponentProgressLoaderContext.Provider, { value: context },
        react_1.default.createElement(react_1.default.Fragment, null,
            loading && react_1.default.createElement(LoadingBar, null),
            react_1.default.createElement(StartLoading, null),
            props.children,
            react_1.default.createElement(EndLoading, null))));
});
//# sourceMappingURL=ComponentProgressLoader.js.map