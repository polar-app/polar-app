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
exports.NavLogo = void 0;
const React = __importStar(require("react"));
const PolarSVGIcon_1 = require("../../../../web/js/ui/svg_icons/PolarSVGIcon");
const Devices_1 = require("polar-shared/src/util/Devices");
const MUIRouterLink_1 = require("../../../../web/js/mui/MUIRouterLink");
const Styles = {
    child: {
        userSelect: 'none'
    },
    textLogo: {
        paddingLeft: '5px',
        fontWeight: 700,
        fontSize: '27px',
        userSelect: 'none',
        textDecoration: 'none'
    }
};
exports.NavLogo = React.memo(() => {
    const createLink = () => {
        if (Devices_1.Devices.get() === 'desktop') {
            return '/';
        }
        else {
            return '/annotations';
        }
    };
    const link = createLink();
    const NavLink = (props) => {
        return (React.createElement(MUIRouterLink_1.MUIRouterLink, { to: { pathname: link, hash: '#' } }, props.children));
    };
    return (React.createElement("div", { style: {
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'nowrap',
        } },
        React.createElement("div", { style: Styles.child },
            React.createElement(NavLink, null,
                React.createElement("div", { style: {
                        height: '50px',
                        width: '50px',
                        display: 'flex',
                        alignItems: 'center',
                        flexWrap: 'nowrap',
                    } },
                    React.createElement(PolarSVGIcon_1.PolarSVGIcon, { width: 50, height: 50 })))),
        React.createElement("div", { style: Styles.child },
            React.createElement(NavLink, null,
                React.createElement("div", { style: Styles.textLogo }, "POLAR")))));
});
//# sourceMappingURL=NavLogo.js.map