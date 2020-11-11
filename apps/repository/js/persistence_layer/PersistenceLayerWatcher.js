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
exports.PersistenceLayerWatcher = void 0;
const React = __importStar(require("react"));
class PersistenceLayerWatcher extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.unmounted = false;
        this.state = {
            iter: 0
        };
    }
    componentDidMount() {
        const { persistenceLayerManager } = this.props;
        const onPersistenceLayer = (persistenceLayer) => {
            this.setState({
                iter: this.state.iter + 1,
                persistenceLayerProvider: () => persistenceLayer
            });
        };
        this.eventListener = (event) => {
            if (this.unmounted) {
                console.warn("We've been unmounted");
            }
            if (event.state === 'changed') {
                onPersistenceLayer(event.persistenceLayer);
            }
        };
        if (persistenceLayerManager.state === 'changed' || persistenceLayerManager.state === 'initialized') {
            onPersistenceLayer(persistenceLayerManager.get());
        }
        persistenceLayerManager.addEventListener(this.eventListener);
        this.unmounted = false;
    }
    componentWillUnmount() {
        if (this.eventListener) {
            this.props.persistenceLayerManager.removeEventListener(this.eventListener);
        }
        this.unmounted = true;
    }
    render() {
        if (this.state.persistenceLayerProvider) {
            return this.props.render(this.state.persistenceLayerProvider);
        }
        return null;
    }
}
exports.PersistenceLayerWatcher = PersistenceLayerWatcher;
//# sourceMappingURL=PersistenceLayerWatcher.js.map