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
exports.GroupDeleteButton = void 0;
const React = __importStar(require("react"));
const UserGroups_1 = require("../../../../web/js/datastore/sharing/db/UserGroups");
const GroupDeletes_1 = require("../../../../web/js/datastore/sharing/rpc/GroupDeletes");
const Toaster_1 = require("../../../../web/js/ui/toaster/Toaster");
const Button_1 = __importDefault(require("@material-ui/core/Button"));
class GroupDeleteButton extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.onDelete = this.onDelete.bind(this);
        this.onDeleteConfirmed = this.onDeleteConfirmed.bind(this);
    }
    render() {
        const { groupData } = this.props;
        if (!groupData) {
            return React.createElement("div", null);
        }
        const { userGroup, id, group } = groupData;
        const isAdmin = UserGroups_1.UserGroups.hasAdminForGroup(id, userGroup);
        return (React.createElement("div", { className: "mr-1 ml-1" },
            React.createElement(Button_1.default, { variant: "contained", hidden: !isAdmin, onClick: () => this.onDelete(group), className: "pl-2 pr-2" },
                React.createElement("i", { className: "fas fa-trash-alt", style: { marginRight: '5px' } }),
                " Delete")));
    }
    onDelete(group) {
    }
    onDeleteConfirmed(group) {
        Toaster_1.Toaster.info(`Going to delete group ${group.name}...`);
        const doHandle = () => __awaiter(this, void 0, void 0, function* () {
            yield GroupDeletes_1.GroupDeletes.exec({ groupID: group.id });
            Toaster_1.Toaster.success(`Deleted group ${group.name} successfully!`);
        });
        doHandle()
            .catch(err => {
            const msg = "Failed to delete group";
            Toaster_1.Toaster.error(msg);
            console.error(msg, err);
        });
    }
}
exports.GroupDeleteButton = GroupDeleteButton;
//# sourceMappingURL=GroupDeleteButton.js.map