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
exports.NavIcon = void 0;
const React = __importStar(require("react"));
const react_router_dom_1 = require("react-router-dom");
const PolarSVGIcon_1 = require("../../../../web/js/ui/svg_icons/PolarSVGIcon");
const Devices_1 = require("polar-shared/src/util/Devices");
class NavIcon extends React.PureComponent {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        const createLink = () => {
            if (Devices_1.Devices.get() === 'desktop') {
                return '/';
            }
            else {
                return '/annotations';
            }
        };
        const link = createLink();
        const NavLink = (props) => (React.createElement(react_router_dom_1.Link, { to: { pathname: link, hash: '#' }, style: {
                display: 'flex',
                alignItems: 'center'
            } }, props.children));
        return (React.createElement(NavLink, null,
            React.createElement(PolarSVGIcon_1.PolarSVGIcon, { width: 35, height: 35 })));
    }
}
exports.NavIcon = NavIcon;
//# sourceMappingURL=NavIcon.js.map