"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIDocDropdownButton = void 0;
const react_1 = __importDefault(require("react"));
const DocRepoDropdownMenu_1 = require("./DocRepoDropdownMenu");
const IconButton_1 = __importDefault(require("@material-ui/core/IconButton"));
const grey_1 = __importDefault(require("@material-ui/core/colors/grey"));
const MoreVert_1 = __importDefault(require("@material-ui/icons/MoreVert"));
const ReactUtils_1 = require("../../../../web/js/react/ReactUtils");
exports.MUIDocDropdownButton = ReactUtils_1.deepMemo((props) => {
    const [state, setState] = react_1.default.useState({ anchorEl: null });
    const handleClick = (event) => {
        props.onClick(event);
        setState({
            anchorEl: event.currentTarget
        });
    };
    const handleClose = () => {
        setState({
            anchorEl: null
        });
    };
    const { anchorEl } = state;
    return (react_1.default.createElement("div", null,
        react_1.default.createElement(IconButton_1.default, { "aria-controls": "doc-dropdown-menu", "aria-haspopup": "true", color: "default", onClick: handleClick, size: "small", style: { color: grey_1.default[500] } },
            react_1.default.createElement(MoreVert_1.default, null)),
        anchorEl &&
            react_1.default.createElement(DocRepoDropdownMenu_1.DocRepoDropdownMenu, { anchorEl: anchorEl, onClose: handleClose })));
});
//# sourceMappingURL=MUIDocDropdownButton.js.map