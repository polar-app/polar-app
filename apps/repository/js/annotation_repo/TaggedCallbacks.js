"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TaggedCallbacks = void 0;
const react_1 = __importDefault(require("react"));
const Tags_1 = require("polar-shared/src/tags/Tags");
const Functions_1 = require("polar-shared/src/util/Functions");
const MUITagInputControls_1 = require("../MUITagInputControls");
var TaggedCallbacks;
(function (TaggedCallbacks) {
    var toAutocompleteOption = MUITagInputControls_1.MUITagInputControls.toAutocompleteOption;
    function create(opts) {
        return () => {
            const { doTagged, dialogs } = opts;
            const targets = opts.targets();
            if (targets.length === 0) {
                console.log("No targets");
                return;
            }
            const availableTags = opts.tagsProvider();
            function computeAutocompleteStrategy() {
                if (targets.length > 1) {
                    return {
                        strategy: 'add',
                        existingTags: [],
                        description: (react_1.default.createElement(react_1.default.Fragment, null,
                            "This will ",
                            react_1.default.createElement("b", null, "ADD"),
                            " the selected tags to ",
                            react_1.default.createElement("b", null, targets.length),
                            " items."))
                    };
                }
                const annotation = targets[0];
                return {
                    strategy: 'set',
                    existingTags: Tags_1.Tags.sortByLabel(Object.values(annotation.tags || {})),
                };
            }
            const autocompleteStrategy = computeAutocompleteStrategy();
            const handleDone = (tags) => {
                doTagged(targets, tags, autocompleteStrategy.strategy);
            };
            const autocompleteProps = {
                title: "Assign Tags",
                description: autocompleteStrategy.description,
                options: availableTags.map(toAutocompleteOption),
                defaultOptions: autocompleteStrategy.existingTags.map(toAutocompleteOption),
                createOption: MUITagInputControls_1.MUITagInputControls.createOption,
                onCancel: Functions_1.NULL_FUNCTION,
                onChange: Functions_1.NULL_FUNCTION,
                relatedOptionsCalculator: opts.relatedOptionsCalculator,
                onDone: tags => handleDone(tags)
            };
            dialogs.autocomplete(autocompleteProps);
        };
    }
    TaggedCallbacks.create = create;
})(TaggedCallbacks = exports.TaggedCallbacks || (exports.TaggedCallbacks = {}));
//# sourceMappingURL=TaggedCallbacks.js.map