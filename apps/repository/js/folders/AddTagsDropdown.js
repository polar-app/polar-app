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
exports.AddTagsDropdown = void 0;
const React = __importStar(require("react"));
const Add_1 = __importDefault(require("@material-ui/icons/Add"));
const CreateNewFolder_1 = __importDefault(require("@material-ui/icons/CreateNewFolder"));
const LocalOffer_1 = __importDefault(require("@material-ui/icons/LocalOffer"));
const MUIMenuItem_1 = require("../../../../web/js/mui/menu/MUIMenuItem");
const MUIMenu_1 = require("../../../../web/js/mui/menu/MUIMenu");
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
exports.AddTagsDropdown = ReactUtils_1.deepMemo((props) => {
    return (React.createElement(MUIMenu_1.MUIMenu, { button: {
            icon: React.createElement(Add_1.default, null)
        }, placement: "bottom-end" },
        React.createElement("div", null,
            React.createElement(MUIMenuItem_1.MUIMenuItem, { onClick: props.onCreateFolder, icon: React.createElement(CreateNewFolder_1.default, null), text: "Create Folder" }),
            React.createElement(MUIMenuItem_1.MUIMenuItem, { onClick: props.onCreateTag, icon: React.createElement(LocalOffer_1.default, null), text: "Create Tag" }))));
});
//# sourceMappingURL=AddTagsDropdown.js.map