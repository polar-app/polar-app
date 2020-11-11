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
exports.PagemarkMenu = exports.usePagemarkValueContext = exports.PagemarkValueContext = void 0;
const React = __importStar(require("react"));
const Functions_1 = require("polar-shared/src/util/Functions");
const DeleteForever_1 = __importDefault(require("@material-ui/icons/DeleteForever"));
const MUIMenuItem_1 = require("../../../../web/js/mui/menu/MUIMenuItem");
exports.PagemarkValueContext = React.createContext(null);
function usePagemarkValueContext() {
    return React.useContext(exports.PagemarkValueContext);
}
exports.usePagemarkValueContext = usePagemarkValueContext;
exports.PagemarkMenu = () => {
    const pagemark = usePagemarkValueContext();
    return (React.createElement(React.Fragment, null,
        React.createElement(MUIMenuItem_1.MUIMenuItem, { text: "Delete Pagemark", icon: React.createElement(DeleteForever_1.default, null), onClick: Functions_1.NULL_FUNCTION })));
};
//# sourceMappingURL=PagemarkMenu.js.map