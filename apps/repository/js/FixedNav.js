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
exports.FixedNavBody = exports.FixedNav = void 0;
const React = __importStar(require("react"));
const Props_1 = require("../../../web/js/react/Props");
class FixedNav extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        return (React.createElement("div", Object.assign({}, (this.props.id ? { id: this.props.id } : {}), (this.props.className ? { className: this.props.className } : {}), { style: {
                display: 'flex',
                flexDirection: 'column',
                flexGrow: 1,
                minWidth: 0,
                minHeight: 0,
            } }), this.props.children));
    }
}
exports.FixedNav = FixedNav;
FixedNav.Header = class extends React.Component {
    render() {
        const style = {
            width: '100%'
        };
        const props = Props_1.Props.merge(this.props, { style });
        return (React.createElement("div", Object.assign({}, props), this.props.children));
    }
};
FixedNav.Body = class extends React.Component {
    render() {
        const style = {
            display: 'flex',
            flexGrow: 1,
            minHeight: 0,
            minWidth: 0,
        };
        const props = Props_1.Props.merge(this.props, { style });
        return (React.createElement("div", Object.assign({}, props), this.props.children));
    }
};
FixedNav.Footer = class extends React.Component {
    render() {
        return (React.createElement("div", Object.assign({}, (this.props.id ? { id: this.props.id } : {}), (this.props.className ? { className: this.props.className } : {}), { style: {
                width: '100%'
            } }), this.props.children));
    }
};
class FixedNavBody extends React.Component {
    render() {
        return (React.createElement("div", Object.assign({}, (this.props.id ? { id: this.props.id } : {}), (this.props.className ? { className: this.props.className } : {}), { style: Object.assign({ flexGrow: 1, overflowY: 'auto', height: '100%', width: '100%' }, this.props.style) }), this.props.children));
    }
}
exports.FixedNavBody = FixedNavBody;
//# sourceMappingURL=FixedNav.js.map