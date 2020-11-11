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
exports.MobileGatewayContent = void 0;
const React = __importStar(require("react"));
const ReactUtils_1 = require("../../../../../web/js/react/ReactUtils");
const PolarSVGIcon_1 = require("../../../../../web/js/ui/svg_icons/PolarSVGIcon");
exports.MobileGatewayContent = ReactUtils_1.deepMemo(() => {
    return (React.createElement("div", null,
        React.createElement("div", { style: { display: 'flex', justifyContent: 'center' } },
            React.createElement(PolarSVGIcon_1.PolarSVGIcon, { width: 250, height: 250 })),
        React.createElement("div", { style: { display: 'flex', justifyContent: 'center' } },
            React.createElement("h1", null, "Mobile Not Yet Supported")),
        React.createElement("h2", { style: { textAlign: 'center' } }, "We don't yet support mobile but we're working on it. Please check back soon!")));
});
//# sourceMappingURL=MobileGatewayContent.js.map