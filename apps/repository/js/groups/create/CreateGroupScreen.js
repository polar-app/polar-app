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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateGroupScreen = void 0;
const React = __importStar(require("react"));
const FixedNav_1 = require("../../FixedNav");
const CreateGroupForm_1 = require("./CreateGroupForm");
const Tags_1 = require("polar-shared/src/tags/Tags");
class CreateGroupScreen extends React.Component {
    constructor(props, context) {
        super(props, context);
        this.createTagsProvider = this.createTagsProvider.bind(this);
        this.state = {};
    }
    render() {
        const tagsProvider = this.createTagsProvider();
        const relatedTags = this.props.repoDocMetaManager.relatedTagsManager;
        return (React.createElement(FixedNav_1.FixedNav, { id: "doc-repository" },
            React.createElement("header", null),
            React.createElement(FixedNav_1.FixedNavBody, { className: "container-fluid" },
                React.createElement("div", { className: "row" },
                    React.createElement("div", { className: "col-lg-12 w-100 pt-2" },
                        React.createElement(CreateGroupForm_1.CreateGroupForm, { relatedTags: relatedTags, tagsProvider: tagsProvider }))))));
    }
    createTagsProvider() {
        return () => {
            const tags = this.props.repoDocMetaManager.repoDocInfoIndex.toTagDescriptors();
            return Tags_1.Tags.onlyRegular(tags);
        };
    }
}
exports.CreateGroupScreen = CreateGroupScreen;
//# sourceMappingURL=CreateGroupScreen.js.map