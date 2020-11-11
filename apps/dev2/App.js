"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
const react_1 = __importDefault(require("react"));
require("@ckeditor/ckeditor5-theme-lark/theme/theme.css");
require("@ckeditor/ckeditor5-theme-lark");
const Functions_1 = require("polar-shared/src/util/Functions");
const ReactUtils_1 = require("../../web/js/react/ReactUtils");
const Menu_1 = __importDefault(require("@material-ui/core/Menu"));
const MenuItem_1 = __importDefault(require("@material-ui/core/MenuItem/MenuItem"));
const CKEditor5_1 = require("../stories/impl/ckeditor5/CKEditor5");
const notes = [
    {
        id: '101',
        content: 'first note',
    },
    {
        id: '102',
        content: 'this is the second note',
        children: [
            {
                id: '103',
                content: 'This is a child note'
            }
        ]
    }
];
const Notes = ReactUtils_1.deepMemo((props) => {
    if (!props.notes) {
        return null;
    }
    return (react_1.default.createElement("ul", null, props.notes.map((note) => (react_1.default.createElement("li", { key: note.id },
        react_1.default.createElement(CKEditor5_1.CKEditor5, { content: note.content, onChange: Functions_1.NULL_FUNCTION }),
        react_1.default.createElement(Notes, { notes: note.children }))))));
});
exports.App = () => {
    return (react_1.default.createElement(react_1.default.Fragment, null,
        react_1.default.createElement(Notes, { notes: notes }),
        react_1.default.createElement(Menu_1.default, { id: "fade-menu", keepMounted: true, open: true, style: { height: '100px' } },
            react_1.default.createElement(MenuItem_1.default, null, "Profile"),
            react_1.default.createElement(MenuItem_1.default, null, "My account"),
            react_1.default.createElement(MenuItem_1.default, null, "Logout"),
            react_1.default.createElement(MenuItem_1.default, null, "Profile"),
            react_1.default.createElement(MenuItem_1.default, null, "My account"),
            react_1.default.createElement(MenuItem_1.default, null, "Logout"),
            react_1.default.createElement(MenuItem_1.default, null, "Profile"),
            react_1.default.createElement(MenuItem_1.default, null, "My account"),
            react_1.default.createElement(MenuItem_1.default, null, "Logout"),
            react_1.default.createElement(MenuItem_1.default, null, "Profile"),
            react_1.default.createElement(MenuItem_1.default, null, "My account"),
            react_1.default.createElement(MenuItem_1.default, null, "Logout"),
            react_1.default.createElement(MenuItem_1.default, null, "Profile"),
            react_1.default.createElement(MenuItem_1.default, null, "My account"),
            react_1.default.createElement(MenuItem_1.default, null, "Logout"),
            react_1.default.createElement(MenuItem_1.default, null, "Profile"),
            react_1.default.createElement(MenuItem_1.default, null, "My account"),
            react_1.default.createElement(MenuItem_1.default, null, "Logout"),
            react_1.default.createElement(MenuItem_1.default, null, "Profile"),
            react_1.default.createElement(MenuItem_1.default, null, "My account"),
            react_1.default.createElement(MenuItem_1.default, null, "Logout"),
            react_1.default.createElement(MenuItem_1.default, null, "Profile"),
            react_1.default.createElement(MenuItem_1.default, null, "My account"),
            react_1.default.createElement(MenuItem_1.default, null, "Logout"))));
};
//# sourceMappingURL=App.js.map