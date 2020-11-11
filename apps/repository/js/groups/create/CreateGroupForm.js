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
exports.CreateGroupForm = void 0;
const React = __importStar(require("react"));
const Logger_1 = require("polar-shared/src/logger/Logger");
const GroupProvisions_1 = require("../../../../../web/js/datastore/sharing/rpc/GroupProvisions");
const Toaster_1 = require("../../../../../web/js/ui/toaster/Toaster");
const InputLabel_1 = __importDefault(require("@material-ui/core/InputLabel"));
const Input_1 = __importDefault(require("@material-ui/core/Input"));
const Button_1 = __importDefault(require("@material-ui/core/Button"));
const log = Logger_1.Logger.create();
class CreateGroupForm extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.formData = {
            name: "",
            description: "",
            tags: []
        };
        this.onTags = this.onTags.bind(this);
        this.onDone = this.onDone.bind(this);
        this.state = {};
    }
    render() {
        return (React.createElement("div", { className: "container" },
            React.createElement("div", { className: "row" },
                React.createElement("div", { className: "col" },
                    React.createElement("h1", null, "Create Group"),
                    React.createElement("p", null, "Create a new group for sharing documents and collaborating with others."),
                    React.createElement(InputLabel_1.default, { htmlFor: "create-group-name" }, "Name"),
                    React.createElement(Input_1.default, { type: "text", name: "name", id: "create-group-name", placeholder: "Name of group", required: true, onChange: event => this.formData.name = event.currentTarget.value }),
                    React.createElement(InputLabel_1.default, { htmlFor: "create-group-description" }, "Description"),
                    React.createElement(Input_1.default, { type: "textarea", name: "description", id: "create-group-description", placeholder: "A description for the group", onChange: event => this.formData.description = event.currentTarget.value }),
                    React.createElement(InputLabel_1.default, null, "Tags"),
                    React.createElement("p", { className: "text-secondary text-sm mt-1" }, "Select up to 5 tags for this group.  Tags will be used by others to find your group."),
                    React.createElement("div", { className: "text-right" },
                        React.createElement(Button_1.default, { color: "primary", variant: "contained", onClick: () => this.onDone() }, "Create Group"))))));
    }
    onTags(tags) {
        this.formData.tags = tags.map(current => current.label);
    }
    onDone() {
        const doGroupProvision = () => __awaiter(this, void 0, void 0, function* () {
            Toaster_1.Toaster.info("Creating your new group. Just a moment...");
            const request = Object.assign(Object.assign({}, this.formData), { docs: [], visibility: 'public', invitations: {
                    message: "",
                    to: []
                } });
            yield GroupProvisions_1.GroupProvisions.exec(request);
            Toaster_1.Toaster.success("Your new group has been created!");
        });
        doGroupProvision()
            .catch(err => log.error(err));
    }
}
exports.CreateGroupForm = CreateGroupForm;
//# sourceMappingURL=CreateGroupForm.js.map