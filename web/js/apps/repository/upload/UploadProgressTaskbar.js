"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useBatchProgressTaskbar = exports.useUploadProgressTaskbar = void 0;
const react_1 = __importDefault(require("react"));
const MUIDialogControllers_1 = require("../../../mui/dialogs/MUIDialogControllers");
function useUploadProgressTaskbar() {
    const dialogManager = MUIDialogControllers_1.useDialogManager();
    return react_1.default.useCallback((upload, nrUploads, opts = {}) => __awaiter(this, void 0, void 0, function* () {
        const message = `Uploading ${upload} of ${nrUploads} file(s)`;
        const updateProgress = yield dialogManager.taskbar(Object.assign({ message }, opts));
        updateProgress({ value: 'indeterminate' });
        return (progress) => {
            if (progress === 'terminate') {
                updateProgress(progress);
                return;
            }
            if (typeof progress === 'number') {
                updateProgress({ value: progress });
                return;
            }
            switch (progress.type) {
                case 'determinate':
                    updateProgress({ value: progress.value });
                    break;
                case 'indeterminate':
                    updateProgress({ value: 'indeterminate' });
                    break;
            }
        };
    }), [dialogManager]);
}
exports.useUploadProgressTaskbar = useUploadProgressTaskbar;
function useBatchProgressTaskbar() {
    const dialogManager = MUIDialogControllers_1.useDialogManager();
    return react_1.default.useCallback((opts) => __awaiter(this, void 0, void 0, function* () {
        const updateProgress = yield dialogManager.taskbar(opts);
        updateProgress({ value: 'indeterminate' });
        return (update) => {
            if (update === 'terminate') {
                updateProgress(update);
                return;
            }
            if (typeof update.progress === 'number') {
                updateProgress({
                    message: update.message,
                    value: update.progress
                });
                return;
            }
            switch (update.progress.type) {
                case 'determinate':
                    updateProgress({
                        message: update.message,
                        value: update.progress.value
                    });
                    break;
                case 'indeterminate':
                    updateProgress({
                        message: update.message,
                        value: 'indeterminate'
                    });
                    break;
            }
        };
    }), [dialogManager]);
}
exports.useBatchProgressTaskbar = useBatchProgressTaskbar;
//# sourceMappingURL=UploadProgressTaskbar.js.map