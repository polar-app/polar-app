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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagAutocompleteDemo = void 0;
const React = __importStar(require("react"));
const MockTags_1 = require("./MockTags");
const MUICreatableAutocomplete_1 = __importDefault(require("../../js/mui/autocomplete/MUICreatableAutocomplete"));
const tags = MockTags_1.MockTags.create();
const toAutocompleteOption = (tag) => ({
    id: tag.id,
    label: tag.label,
    value: tag
});
const tagOptions = tags.map(toAutocompleteOption);
const createOption = (input) => ({
    id: input,
    label: input,
    value: {
        id: input,
        label: input,
    }
});
const defaultOptions = tagOptions.slice(0, 2);
exports.TagAutocompleteDemo = () => (React.createElement("div", { style: { margin: '10px' } },
    React.createElement(MUICreatableAutocomplete_1.default, { label: "Create or select tags: ", autoFocus: true, options: tagOptions, defaultOptions: defaultOptions, onChange: selected => console.log('selected: ', selected), createOption: createOption })));
//# sourceMappingURL=TagAutocompleteDemo.js.map