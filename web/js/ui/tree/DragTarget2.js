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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DragTarget2 = exports.useDragContext = exports.DragContext = void 0;
const React = __importStar(require("react"));
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
exports.DragContext = React.createContext({ active: false });
function useDragContext() {
    return React.useContext(exports.DragContext);
}
exports.useDragContext = useDragContext;
class DragTarget2 extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onDragOver = this.onDragOver.bind(this);
        this.onDragLeave = this.onDragLeave.bind(this);
        this.onDrop = this.onDrop.bind(this);
        this.acceptDrag = this.acceptDrag.bind(this);
        this.state = {
            active: false
        };
    }
    shouldComponentUpdate(nextProps, nextState, context) {
        return !react_fast_compare_1.default(this.props, nextProps) || !react_fast_compare_1.default(this.state, nextState);
    }
    acceptDrag() {
        if (this.props.acceptDrag) {
            return this.props.acceptDrag();
        }
        return true;
    }
    onDragOver(event) {
        if (!this.acceptDrag()) {
            return;
        }
        if (!this.state.active) {
            this.setState({ active: true });
        }
        event.preventDefault();
        event.stopPropagation();
    }
    onDragLeave(event) {
        if (!this.acceptDrag()) {
            return;
        }
        if (this.state.active) {
            this.setState({ active: false });
        }
        event.stopPropagation();
    }
    onDrop(event) {
        if (!this.acceptDrag()) {
            return;
        }
        this.setState({ active: false });
        this.props.onDrop(event);
    }
    render() {
        const { active } = this.state;
        return (React.createElement("div", { onDragOver: (event) => this.onDragOver(event), onDragLeave: (event) => this.onDragLeave(event), onDrop: (event) => this.onDrop(event) },
            React.createElement(exports.DragContext.Provider, { value: { active } }, this.props.children)));
    }
}
exports.DragTarget2 = DragTarget2;
//# sourceMappingURL=DragTarget2.js.map