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
exports.TwoMigrationDialog = void 0;
const React = __importStar(require("react"));
const Dialog_1 = __importDefault(require("@material-ui/core/Dialog"));
const DialogContent_1 = __importDefault(require("@material-ui/core/DialogContent"));
const DialogActions_1 = __importDefault(require("@material-ui/core/DialogActions"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const TwoMigrationContent_1 = require("./TwoMigrationContent");
exports.TwoMigrationDialog = React.memo((props) => {
    const [open, setOpen] = React.useState(true);
    function handleClose() {
        setOpen(false);
        props.onClose();
    }
    return (React.createElement(Dialog_1.default, { maxWidth: 'md', open: open, onClose: handleClose },
        React.createElement(DialogContent_1.default, null,
            React.createElement(TwoMigrationContent_1.TwoMigrationContent, null)),
        React.createElement(DialogActions_1.default, { style: { justifyContent: 'center' } },
            React.createElement(Button_1.default, { color: "primary", variant: "contained", size: "large", onClick: handleClose }, "Let's Get Started"))));
});
//# sourceMappingURL=TwoMigrationDialog.js.map