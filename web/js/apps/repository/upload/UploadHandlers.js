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
exports.useBatchUploader = void 0;
const UploadProgressTaskbar_1 = require("./UploadProgressTaskbar");
const react_1 = __importDefault(require("react"));
function useBatchUploader() {
    const createBatchProgressTaskbar = UploadProgressTaskbar_1.useBatchProgressTaskbar();
    const cancelled = react_1.default.useRef(false);
    return react_1.default.useCallback((uploadHandlers) => __awaiter(this, void 0, void 0, function* () {
        let controller;
        function onWriteController(newController) {
            controller = newController;
        }
        function onCancel() {
            cancelled.current = true;
            if (!controller) {
                return;
            }
            controller.cancel();
        }
        const updateProgress = yield createBatchProgressTaskbar({
            message: `Starting upload of ${uploadHandlers.length} files ... `,
            onCancel,
            noAutoTerminate: true
        });
        const updateProgressCallback = (progress) => {
            if (progress === 'terminate') {
                return;
            }
            updateProgress({ progress });
        };
        try {
            const results = [];
            for (const [idx, uploadHandler] of uploadHandlers.entries()) {
                try {
                    updateProgress({
                        message: `Uploading file ${idx + 1} of ${uploadHandlers.length} ...`,
                        progress: 0
                    });
                    const result = yield uploadHandler(updateProgressCallback, onWriteController);
                    results.push(result);
                }
                catch (e) {
                    if (['cancelled', 'canceled'].includes(e.code) || ['storage/cancelled', 'storage/canceled'].includes(e.code_)) {
                        console.log("Caught cancelled upload exception");
                    }
                    else {
                        throw e;
                    }
                }
                finally {
                    updateProgress({ progress: 100 });
                }
                if (cancelled.current) {
                    break;
                }
            }
            return results;
        }
        finally {
            updateProgress('terminate');
            cancelled.current = false;
        }
    }), [createBatchProgressTaskbar]);
}
exports.useBatchUploader = useBatchUploader;
//# sourceMappingURL=UploadHandlers.js.map