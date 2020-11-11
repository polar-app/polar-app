"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NotificationForPrivateGroupDoc = void 0;
const react_1 = __importDefault(require("react"));
const Logger_1 = require("polar-shared/src/logger/Logger");
const UserImage_1 = require("./UserImage");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const log = Logger_1.Logger.create();
class NotificationForPrivateGroupDoc extends react_1.default.Component {
    constructor(props) {
        super(props);
        this.onAdd = this.onAdd.bind(this);
    }
    render() {
        const { invitation } = this.props;
        const doc = invitation.docs[0];
        const from = invitation.from;
        return (react_1.default.createElement("div", { className: "" },
            react_1.default.createElement("div", { className: "text-lg" }, doc.title),
            react_1.default.createElement("div", null, doc.description || ""),
            react_1.default.createElement("p", { className: "border-left border-secondary ml-1 pl-1 mt-1" }, invitation.message),
            react_1.default.createElement("div", { style: { display: 'flex' } },
                react_1.default.createElement("div", { className: "mt-auto mb-auto", style: {
                        flexGrow: 1,
                        display: 'flex'
                    } },
                    react_1.default.createElement(UserImage_1.UserImage, { name: from.name, image: from.image }),
                    react_1.default.createElement("div", { className: "mt-auto mb-auto ml-1" }, from.name)),
                react_1.default.createElement("div", { className: "mt-auto mb-auto" },
                    react_1.default.createElement(Button_1.default, { color: "primary", variant: "contained", onClick: () => this.onAdd(), style: {
                            fontSize: '15px',
                            fontWeight: 'bold'
                        }, className: "" },
                        react_1.default.createElement("i", { className: "fas fa-plus", style: { marginRight: '5px' } }),
                        " Add \u00A0")))));
    }
    onAdd() {
        const persistenceLayer = this.props.persistenceLayerProvider();
        const { invitation } = this.props;
    }
}
exports.NotificationForPrivateGroupDoc = NotificationForPrivateGroupDoc;
//# sourceMappingURL=NotificationForPrivateGroupDoc.js.map