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
Object.defineProperty(exports, "__esModule", { value: true });
exports.Outliner = void 0;
const React = __importStar(require("react"));
const DocViewerStore_1 = require("../DocViewerStore");
const OutlinerStore_1 = require("./OutlinerStore");
const MUILogger_1 = require("../../../../web/js/mui/MUILogger");
const NoOutlineAvailable = React.memo(() => {
    return (React.createElement("div", { style: { textAlign: 'center' } },
        React.createElement("h2", null, "No Outline Available")));
});
const OutlineTreeView = React.memo(() => {
    const { outline, outlineNavigator } = DocViewerStore_1.useDocViewerStore(['outline', 'outlineNavigator']);
    const log = MUILogger_1.useLogger();
    const handleNavigation = React.useCallback((location) => {
        if (!location) {
            console.warn("No location");
            return;
        }
        function doAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!outlineNavigator) {
                    console.warn("No outlineNavigator: ", outlineNavigator);
                    return;
                }
                yield outlineNavigator(location);
            });
        }
        doAsync().catch(err => log.error(err));
    }, [log, outlineNavigator]);
    const toTreeItem = React.useCallback((item) => {
        return (React.createElement("div", { key: item.id, style: {
                fontSize: '1.25rem',
                cursor: 'pointer',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis'
            }, onClick: () => handleNavigation(item.destination) },
            item.title,
            React.createElement("div", { style: { marginLeft: '1.25rem' } }, item.children.map(toTreeItem))));
    }, [handleNavigation]);
    if (!outline) {
        return (React.createElement(NoOutlineAvailable, null));
    }
    return (React.createElement("div", { style: { margin: '1rem' } }, outline.items.map(toTreeItem)));
});
exports.Outliner = React.memo(() => {
    return (React.createElement(OutlinerStore_1.OutlinerStoreProviderDelegate, null,
        React.createElement(OutlineTreeView, null)));
});
//# sourceMappingURL=Outliner.js.map