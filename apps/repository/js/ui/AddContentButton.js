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
exports.AddContent = void 0;
const React = __importStar(require("react"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const Add_1 = __importDefault(require("@material-ui/icons/Add"));
const AddContentFab_1 = require("./AddContentFab");
const react_router_dom_1 = require("react-router-dom");
const MUITooltip_1 = require("../../../../web/js/mui/MUITooltip");
var AddContent;
(function (AddContent) {
    function useAddFileDropzone() {
        const history = react_router_dom_1.useHistory();
        return () => {
            history.push({ hash: "#add" });
        };
    }
    AddContent.Handheld = () => {
        const doAdd = useAddFileDropzone();
        return (React.createElement(AddContentFab_1.AddContentFab, { onClick: () => doAdd() }));
    };
    AddContent.Desktop = () => {
        const doAdd = useAddFileDropzone();
        return (React.createElement(MUITooltip_1.MUITooltip, { title: "Upload and add PDFs and EPUBs to your repository" },
            React.createElement(Button_1.default, { id: "add-content-dropdown", variant: "contained", color: "primary", startIcon: React.createElement(Add_1.default, null), onClick: doAdd, style: {
                    minWidth: '285px'
                }, size: "large" }, "Add Document")));
    };
})(AddContent = exports.AddContent || (exports.AddContent = {}));
//# sourceMappingURL=AddContentButton.js.map