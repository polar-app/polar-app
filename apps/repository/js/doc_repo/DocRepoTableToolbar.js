"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DocRepoTableToolbar = void 0;
const react_1 = __importDefault(require("react"));
const Grid_1 = __importDefault(require("@material-ui/core/Grid"));
const Box_1 = __importDefault(require("@material-ui/core/Box"));
const Checkbox_1 = __importDefault(require("@material-ui/core/Checkbox"));
const Divider_1 = __importDefault(require("@material-ui/core/Divider"));
const AutoBlur_1 = require("./AutoBlur");
const DocRepoStore2_1 = require("./DocRepoStore2");
const react_fast_compare_1 = __importDefault(require("react-fast-compare"));
const MUIDocTagButton_1 = require("./buttons/MUIDocTagButton");
const MUIDocArchiveButton_1 = require("./buttons/MUIDocArchiveButton");
const MUIDocFlagButton_1 = require("./buttons/MUIDocFlagButton");
const MUIDocDeleteButton_1 = require("./buttons/MUIDocDeleteButton");
exports.DocRepoTableToolbar = react_1.default.memo(() => {
    const { view, selected } = DocRepoStore2_1.useDocRepoStore(['view', 'selected']);
    const callbacks = DocRepoStore2_1.useDocRepoCallbacks();
    const { setSelected } = callbacks;
    const handleCheckbox = (checked) => {
        if (checked) {
            setSelected('all');
        }
        else {
            setSelected('none');
        }
    };
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Grid_1.default, { container: true, direction: "row", justify: "space-between", alignItems: "center" },
            react_1.default.createElement(Grid_1.default, { item: true },
                react_1.default.createElement(Box_1.default, { pl: 0 },
                    react_1.default.createElement(Grid_1.default, { container: true, spacing: 1, direction: "row", justify: "flex-start", style: {
                            flexWrap: 'nowrap'
                        }, alignItems: "center" },
                        react_1.default.createElement(Grid_1.default, { item: true },
                            react_1.default.createElement(AutoBlur_1.AutoBlur, null,
                                react_1.default.createElement(Box_1.default, { mt: 1, mb: 1 },
                                    react_1.default.createElement(Checkbox_1.default, { size: "medium", indeterminate: selected.length > 0 && selected.length < view.length, checked: selected.length === view.length && view.length !== 0, onChange: event => handleCheckbox(event.target.checked), inputProps: { 'aria-label': 'select all documents' } })))),
                        selected.length > 0 && (react_1.default.createElement(react_1.default.Fragment, null,
                            react_1.default.createElement(Grid_1.default, { item: true },
                                react_1.default.createElement(MUIDocTagButton_1.MUIDocTagButton, { onClick: callbacks.onTagged, size: "medium" })),
                            react_1.default.createElement(Grid_1.default, { item: true },
                                react_1.default.createElement(MUIDocArchiveButton_1.MUIDocArchiveButton, { onClick: callbacks.onArchived, size: "medium" })),
                            react_1.default.createElement(Grid_1.default, { item: true },
                                react_1.default.createElement(MUIDocFlagButton_1.MUIDocFlagButton, { onClick: callbacks.onFlagged, size: "medium" })),
                            react_1.default.createElement(Divider_1.default, { orientation: "vertical", variant: "middle", flexItem: true }),
                            react_1.default.createElement(Grid_1.default, { item: true },
                                react_1.default.createElement(MUIDocDeleteButton_1.MUIDocDeleteButton, { size: "medium", onClick: callbacks.onDeleted }))))))))));
}, react_fast_compare_1.default);
//# sourceMappingURL=DocRepoTableToolbar.js.map