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
exports.UserTagsProvider = exports.useUserTags = void 0;
const React = __importStar(require("react"));
const UserTagsDB_1 = require("../../../../web/js/datastore/UserTagsDB");
const PersistenceLayerApp_1 = require("./PersistenceLayerApp");
const PrefsHook_1 = require("./PrefsHook");
function useUserTags() {
    const { value, error } = PrefsHook_1.usePrefs();
    if (value) {
        const userTagsDB = new UserTagsDB_1.UserTagsDB(value);
        userTagsDB.init();
        return {
            value: userTagsDB.tags(),
            error: undefined
        };
    }
    return { value: undefined, error };
}
exports.useUserTags = useUserTags;
exports.UserTagsProvider = React.memo((props) => {
    const userTagsRef = React.useRef({ value: [], error: undefined });
    userTagsRef.current = useUserTags();
    const tagsProvider = React.useMemo(() => () => userTagsRef.current.value || [], []);
    const context = React.useMemo(() => {
        return { tagsProvider };
    }, [tagsProvider]);
    return (React.createElement(PersistenceLayerApp_1.TagsContext.Provider, { value: context }, props.children));
});
//# sourceMappingURL=UserTagsProvider2.js.map