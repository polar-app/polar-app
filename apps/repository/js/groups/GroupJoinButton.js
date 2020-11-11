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
exports.GroupJoinButton = void 0;
const react_1 = __importDefault(require("react"));
const GroupJoins_1 = require("../../../../web/js/datastore/sharing/rpc/GroupJoins");
const Logger_1 = require("polar-shared/src/logger/Logger");
const Toaster_1 = require("../../../../web/js/ui/toaster/Toaster");
const Groups_1 = require("../../../../web/js/datastore/sharing/db/Groups");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const log = Logger_1.Logger.create();
class GroupJoinButton extends react_1.default.PureComponent {
    constructor(props) {
        super(props);
        this.onJoin = this.onJoin.bind(this);
        this.state = {};
    }
    render() {
        return (react_1.default.createElement("div", { className: "mr-1 ml-1" },
            react_1.default.createElement(Button_1.default, { color: "primary", variant: "contained", onClick: () => this.onJoin(), className: "pl-2 pr-2" }, "Join")));
    }
    onJoin() {
        const handler = () => __awaiter(this, void 0, void 0, function* () {
            const group = yield Groups_1.Groups.getByName(this.props.name);
            if (!group) {
                Toaster_1.Toaster.error("No group named: " + this.props.name);
                return;
            }
            Toaster_1.Toaster.info("Joining group...");
            const request = {
                groupID: group.id
            };
            yield GroupJoins_1.GroupJoins.exec(request);
            Toaster_1.Toaster.success("Joining group...done");
        });
        handler()
            .catch(err => log.error("Unable to join group: ", err));
    }
}
exports.GroupJoinButton = GroupJoinButton;
//# sourceMappingURL=GroupJoinButton.js.map