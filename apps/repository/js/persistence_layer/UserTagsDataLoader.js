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
exports.UserTagsDataLoader = void 0;
const React = __importStar(require("react"));
const DataLoader_1 = require("../../../../web/js/ui/data_loader/DataLoader");
const UserTagsDB_1 = require("../../../../web/js/datastore/UserTagsDB");
class UserTagsDataLoader extends React.Component {
    render() {
        const persistenceLayer = this.props.persistenceLayerProvider();
        if (!persistenceLayer) {
            return null;
        }
        const datastore = persistenceLayer.datastore;
        const prefs = datastore.getPrefs();
        if (!prefs) {
            throw new Error("No prefs found from datastore: " + datastore.id);
        }
        if (!prefs.subscribe || !prefs.get) {
            throw new Error("Prefs is missing subscribe|get function(s) from datastore: " + datastore.id);
        }
        const render = (persistentPrefs) => {
            if (persistentPrefs) {
                const userTagsDB = new UserTagsDB_1.UserTagsDB(persistentPrefs);
                userTagsDB.init();
                const userTags = userTagsDB.tags();
                return this.props.render(userTags);
            }
            else {
                return this.props.render(undefined);
            }
        };
        const provider = (onNext, onError) => prefs.subscribe(onNext, onError);
        return (React.createElement(DataLoader_1.DataLoader, { id: "userTags", provider: provider, render: prefs => render(prefs) }));
    }
}
exports.UserTagsDataLoader = UserTagsDataLoader;
//# sourceMappingURL=UserTagsDataLoader.js.map