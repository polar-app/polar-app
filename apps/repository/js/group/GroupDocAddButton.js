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
exports.GroupDocAddButton = void 0;
const react_1 = __importDefault(require("react"));
const Logger_1 = require("polar-shared/src/logger/Logger");
const Toaster_1 = require("../../../../web/js/ui/toaster/Toaster");
const GroupDatastores_1 = require("../../../../web/js/datastore/sharing/GroupDatastores");
const GroupDocs_1 = require("../../../../web/js/datastore/sharing/db/GroupDocs");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const log = Logger_1.Logger.create();
class GroupDocAddButton extends react_1.default.PureComponent {
    constructor(props) {
        super(props);
        this.onJoin = this.onJoin.bind(this);
        this.state = {};
    }
    render() {
        return (react_1.default.createElement("div", { className: "mr-1 ml-1" },
            react_1.default.createElement(Button_1.default, { color: "primary", variant: "contained", onClick: () => this.onJoin(), className: "pl-2 pr-2" },
                react_1.default.createElement("i", { className: "fas fa-plus", style: { marginRight: '5px' } }),
                " Add")));
    }
    onJoin() {
        const handler = () => __awaiter(this, void 0, void 0, function* () {
            const { groupID, fingerprint } = this.props;
            Toaster_1.Toaster.info("Adding document to your document repository...");
            const docRefs = yield GroupDocs_1.GroupDocs.getByFingerprint(groupID, fingerprint);
            if (docRefs.length === 0) {
                Toaster_1.Toaster.error("No group docs to add");
                return;
            }
            const docRef = docRefs[0];
            const groupDocRef = {
                groupID,
                docRef
            };
            const persistenceLayer = this.props.persistenceLayerProvider();
            yield GroupDatastores_1.GroupDatastores.importFromGroup(persistenceLayer, groupDocRef);
            Toaster_1.Toaster.success("Adding document to your document repository...done");
        });
        handler()
            .catch(err => log.error("Unable to join group: ", err));
    }
}
exports.GroupDocAddButton = GroupDocAddButton;
//# sourceMappingURL=GroupDocAddButton.js.map