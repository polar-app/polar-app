"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadProgressDialog = void 0;
const react_1 = __importDefault(require("react"));
const ProgressDialog_1 = require("./ProgressDialog");
const CloudUpload_1 = __importDefault(require("@material-ui/icons/CloudUpload"));
exports.UploadProgressDialog = (props) => {
    return (react_1.default.createElement(ProgressDialog_1.ProgressDialog, { title: "Just a few seconds", description: "You file is uploading right now. Just give us a second to finish up.", value: props.value, icon: react_1.default.createElement(CloudUpload_1.default, { fontSize: "large", color: "primary" }) }));
};
//# sourceMappingURL=UploadProgressDialog.js.map