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
exports.SimpleTab = void 0;
const React = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const ReactRouterLinks_1 = require("../ReactRouterLinks");
class SimpleTab extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.toggleHover = this.toggleHover.bind(this);
        this.state = {
            hover: false
        };
    }
    render() {
        const active = ReactRouterLinks_1.ReactRouterLinks.isActive(this.props.target);
        const computeBorderColor = () => {
            if (active) {
                return 'var(--primary600)';
            }
            if (this.state.hover) {
                return 'var(--grey400)';
            }
            return 'transparent';
        };
        const borderColor = computeBorderColor();
        const borderBottom = `3px solid ${borderColor}`;
        const color = active ? 'var(--grey900)' : 'var(--grey700)';
        return (React.createElement("div", { id: this.props.id, className: "mr-1" },
            React.createElement(react_router_dom_1.Link, { to: this.props.target, className: "p-2", onMouseEnter: () => this.toggleHover(), onMouseLeave: () => this.toggleHover(), style: {
                    color,
                    textDecoration: 'none',
                    borderBottom,
                    userSelect: 'none',
                    whiteSpace: 'nowrap'
                } }, this.props.text)));
    }
    toggleHover() {
        this.setState(Object.assign(Object.assign({}, this.state), { hover: !this.state.hover }));
    }
}
exports.SimpleTab = SimpleTab;
//# sourceMappingURL=SimpleTab.js.map