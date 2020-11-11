"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MUITagInputControls = void 0;
var MUITagInputControls;
(function (MUITagInputControls) {
    function toAutocompleteOption(tag) {
        return {
            id: tag.id,
            label: tag.label,
            value: {
                id: tag.id,
                label: tag.label,
            }
        };
    }
    MUITagInputControls.toAutocompleteOption = toAutocompleteOption;
    function createOption(input) {
        input = input.trim();
        return {
            id: input,
            label: input,
            value: {
                id: input,
                label: input,
            }
        };
    }
    MUITagInputControls.createOption = createOption;
})(MUITagInputControls = exports.MUITagInputControls || (exports.MUITagInputControls = {}));
//# sourceMappingURL=MUITagInputControls.js.map