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
exports.AddFileDropzone = exports.useDragAndDropBackdropListener = exports.useDragAndDropImportListener = void 0;
const React = __importStar(require("react"));
const AddFileDropzoneStore_1 = require("./AddFileDropzoneStore");
const ReactLifecycleHooks_1 = require("../../../hooks/ReactLifecycleHooks");
const AddFileDropzoneDialog2_1 = require("./AddFileDropzoneDialog2");
const MUILogger_1 = require("../../../mui/MUILogger");
const AddFileHooks_1 = require("./AddFileHooks");
const Uploads_1 = require("./Uploads");
const FileSystemEntries_1 = require("./FileSystemEntries");
var useAddFileImporter = AddFileHooks_1.AddFileHooks.useAddFileImporter;
const MUIDialogControllers_1 = require("../../../mui/dialogs/MUIDialogControllers");
function useTaskProgress() {
    const dialogManager = MUIDialogControllers_1.useDialogManager();
    return React.useCallback((message, delegate) => __awaiter(this, void 0, void 0, function* () {
        const progressCallback = yield dialogManager.taskbar({ message });
        progressCallback({ value: 'indeterminate' });
        yield delegate();
        progressCallback({ value: 100 });
    }), [dialogManager]);
}
function useDropHandler() {
    const log = MUILogger_1.useLogger();
    const addFileImporter = useAddFileImporter();
    const dialogManager = MUIDialogControllers_1.useDialogManager();
    return React.useCallback((event) => {
        event.preventDefault();
        function doAsync() {
            return __awaiter(this, void 0, void 0, function* () {
                if (!event.dataTransfer) {
                    return;
                }
                if (!event.dataTransfer.types) {
                    return;
                }
                if (!event.dataTransfer.types.includes('Files')) {
                    return;
                }
                const progressCallback = yield dialogManager.taskbar({
                    message: "Computing file list... one sec.",
                    autoHideDuration: 1,
                    completedDuration: 1
                });
                progressCallback({ value: 'indeterminate' });
                if (event.dataTransfer.items) {
                    const items = Array.from(event.dataTransfer.items);
                    const files = yield FileSystemEntries_1.FileSystemEntries.recurseDataTransferItems(items);
                    const uploads = yield Uploads_1.Uploads.fromFileSystemEntries(files);
                    progressCallback({ value: 100 });
                    addFileImporter(uploads);
                }
                else if (event.dataTransfer.files) {
                    const uploads = Uploads_1.Uploads.fromFiles(event.dataTransfer.files);
                    progressCallback({ value: 100 });
                    addFileImporter(uploads);
                }
            });
        }
        doAsync()
            .catch(err => log.error(err));
    }, [addFileImporter, dialogManager, log]);
}
function isFileTransfer(event) {
    if (!event.dataTransfer) {
        return false;
    }
    console.log("Handling file transfer: ", event.dataTransfer.types);
    if (event.dataTransfer.types) {
        if (event.dataTransfer.types.includes('Files') ||
            event.dataTransfer.types.includes('application/x-moz-file')) {
            return true;
        }
    }
    if (!event.dataTransfer.files) {
        return false;
    }
    if (event.dataTransfer.files.length === 0) {
        return false;
    }
    return true;
}
function useDragAndDropImportListener() {
    const dropHandler = useDropHandler();
    const handleDragOver = React.useCallback((event) => {
        event.preventDefault();
    }, []);
    const handleDrop = React.useCallback((event) => {
        dropHandler(event);
    }, [dropHandler]);
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        window.addEventListener('dragover', handleDragOver);
        window.addEventListener('drop', handleDrop);
    });
    ReactLifecycleHooks_1.useComponentWillUnmount(() => {
        window.removeEventListener('dragover', handleDragOver);
        window.removeEventListener('drop', handleDrop);
    });
}
exports.useDragAndDropImportListener = useDragAndDropImportListener;
function useDragAndDropBackdropListener() {
    const { setActive } = AddFileDropzoneStore_1.useAddFileDropzoneCallbacks();
    const depth = React.useRef(0);
    const onDragEnter = React.useCallback((event) => {
        if (!isFileTransfer(event)) {
            return;
        }
        window.focus();
        if (depth.current === 0) {
            setActive(true);
        }
        ++depth.current;
    }, [setActive]);
    const onDragLeaveOrDrop = React.useCallback((event) => {
        if (!isFileTransfer(event)) {
            return;
        }
        --depth.current;
        if (depth.current === 0) {
            setActive(false);
        }
    }, [setActive]);
    ReactLifecycleHooks_1.useComponentDidMount(() => {
        window.addEventListener('dragenter', onDragEnter);
        window.addEventListener('dragleave', onDragLeaveOrDrop);
        window.addEventListener('drop', onDragLeaveOrDrop);
    });
    ReactLifecycleHooks_1.useComponentWillUnmount(() => {
        window.removeEventListener('dragenter', onDragEnter);
        window.removeEventListener('dragleave', onDragLeaveOrDrop);
        window.removeEventListener('drop', onDragLeaveOrDrop);
    });
}
exports.useDragAndDropBackdropListener = useDragAndDropBackdropListener;
exports.AddFileDropzone = React.forwardRef((props, ref) => {
    const { active } = AddFileDropzoneStore_1.useAddFileDropzoneStore(['active']);
    const callbacks = AddFileDropzoneStore_1.useAddFileDropzoneCallbacks();
    function closeDialog() {
        callbacks.setActive(false);
    }
    return (React.createElement(AddFileDropzoneDialog2_1.AddFileDropzoneDialog2, { open: active, onClose: closeDialog }));
});
//# sourceMappingURL=AddFileDropzone.js.map