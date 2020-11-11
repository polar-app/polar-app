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
exports.LinkHost = void 0;
const React = __importStar(require("react"));
const NullCollapse_1 = require("../../../../web/js/ui/null_collapse/NullCollapse");
class LinkHost extends React.Component {
    constructor(props, context) {
        super(props, context);
    }
    render() {
        const parseHost = () => {
            const { url } = this.props;
            if (!url) {
                return undefined;
            }
            const parsedURL = new URL(url);
            return parsedURL.host;
        };
        const host = parseHost();
        return (React.createElement("div", null,
            React.createElement(NullCollapse_1.NullCollapse, { open: host !== undefined },
                React.createElement("div", { className: "mr-1" }, host))));
    }
}
exports.LinkHost = LinkHost;
//# sourceMappingURL=LinkHost.js.map