"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUIDocContextMenu = void 0;
const react_1 = __importDefault(require("react"));
const Menu_1 = __importDefault(require("@material-ui/core/Menu"));
const MUIDocDropdownMenuItems_1 = require("./MUIDocDropdownMenuItems");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
class MUIDocContextMenu extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.handleContextMenu = this.handleContextMenu.bind(this);
        this.state = {};
    }
    shouldComponentUpdate(nextProps, nextState) {
        return !react_fast_compare_1.default(this.props, nextProps) || !react_fast_compare_1.default(this.state, nextState);
    }
    handleContextMenu(event) {
        event.preventDefault();
        this.setState({
            mouseX: event.clientX - 2,
            mouseY: event.clientY - 4,
        });
    }
    render() {
        const handleClose = () => {
            this.setState({
                mouseX: undefined,
                mouseY: undefined
            });
        };
        function handleContextMenu(event) {
            event.preventDefault();
        }
        return (react_1.default.createElement(react_1.default.Fragment, null,
            this.state.mouseX !== undefined && this.state.mouseY !== undefined &&
                react_1.default.createElement(Menu_1.default, { keepMounted: true, open: this.state.mouseX !== undefined, onClose: () => handleClose(), onClick: () => handleClose(), onContextMenu: handleContextMenu, anchorReference: "anchorPosition", anchorPosition: {
                        top: this.state.mouseY,
                        left: this.state.mouseX
                    } },
                    react_1.default.createElement("div", null,
                        react_1.default.createElement(MUIDocDropdownMenuItems_1.MUIDocDropdownMenuItems, null))),
            this.props.render(this.handleContextMenu)));
    }
}
exports.MUIDocContextMenu = MUIDocContextMenu;
//# sourceMappingURL=MUIDocContextMenu.js.map