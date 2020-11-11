"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDocMigration = void 0;
const react_1 = __importDefault(require("react"));
const MUIDialogControllers_1 = require("../../../mui/dialogs/MUIDialogControllers");
const FilePaths_1 = require("polar-shared/src/util/FilePaths");
const LinkLoaderHook_1 = require("../../../ui/util/LinkLoaderHook");
function useDocMigration() {
    const dialogs = MUIDialogControllers_1.useDialogManager();
    const linkLoader = LinkLoaderHook_1.useLinkLoader();
    const onAccept = react_1.default.useCallback((loadDocRequest) => {
        const params = {
            url: encodeURIComponent(loadDocRequest.url),
            docID: loadDocRequest.fingerprint
        };
        const url = `https://beta.getpolarized.io/migration/phz?docID=${params.docID}&url=${params.url}`;
        linkLoader(url, { newWindow: true, focus: true });
    }, [linkLoader]);
    return react_1.default.useCallback((loadDocRequest) => {
        const { backendFileRef } = loadDocRequest;
        const fileName = backendFileRef.name;
        if (FilePaths_1.FilePaths.hasExtension(fileName, "phz")) {
            dialogs.confirm({
                title: "This is a legacy document that needs to be migrated",
                acceptText: "Start Migration",
                subtitle: (react_1.default.createElement("div", null,
                    react_1.default.createElement("p", null, "This is a legacy web capture document which must be migrated to our new document format as part of 2.0."),
                    react_1.default.createElement("p", null, "The migration assistant will:"),
                    react_1.default.createElement("ul", null,
                        react_1.default.createElement("li", null, "Trigger web capture again to use our new web capture system."),
                        react_1.default.createElement("li", null, "Preserve all your existing metadata (title, flagged, archived, etc)"),
                        react_1.default.createElement("li", null, "Migrate your text highlights, comments, and flashcards.")),
                    react_1.default.createElement("p", null,
                        "As part of the migration we are ",
                        react_1.default.createElement("b", null, "NOT"),
                        " able to preserve pagemarks or area highlights."))),
                onAccept: () => onAccept(loadDocRequest)
            });
            return true;
        }
        else {
            return false;
        }
    }, [dialogs, onAccept]);
}
exports.useDocMigration = useDocMigration;
//# sourceMappingURL=DocMigration.js.map