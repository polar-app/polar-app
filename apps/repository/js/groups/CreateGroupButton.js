"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGroupButton = void 0;
const react_1 = __importDefault(require("react"));
const Logger_1 = require("polar-shared/src/logger/Logger");
const react_router_dom_1 = require("react-router-dom");
const log = Logger_1.Logger.create();
class CreateGroupButton extends react_1.default.PureComponent {
    constructor(props) {
        super(props);
        this.onCreate = this.onCreate.bind(this);
        this.state = {};
    }
    render() {
        return (react_1.default.createElement(react_router_dom_1.Link, { to: { pathname: "/groups/create" }, onClick: () => this.onCreate(), className: "btn btn-success btn-sm" }, "Create Group"));
    }
    onCreate() {
        const handler = () => __awaiter(this, void 0, void 0, function* () {
        });
        handler()
            .catch(err => log.error("Unable to join group: ", err));
        return false;
    }
}
exports.CreateGroupButton = CreateGroupButton;
//# sourceMappingURL=CreateGroupButton.js.map