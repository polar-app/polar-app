"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserImage = exports.Img = void 0;
const react_1 = __importDefault(require("react"));
class Img extends react_1.default.Component {
    constructor(props) {
        super(props);
    }
    render() {
        if (this.props.image) {
            return react_1.default.createElement("img", { alt: this.props.name, src: this.props.image.url, className: "rounded", style: {
                    maxHeight: '32px',
                    maxWidth: '32px'
                } });
        }
        else {
            return react_1.default.createElement("div", null);
        }
    }
}
exports.Img = Img;
class UserImage extends react_1.default.PureComponent {
    constructor(props) {
        super(props);
    }
    render() {
        return (react_1.default.createElement(Img, Object.assign({}, this.props)));
    }
}
exports.UserImage = UserImage;
//# sourceMappingURL=UserImage.js.map