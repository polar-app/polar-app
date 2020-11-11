"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdatesController = void 0;
const Logger_1 = require("polar-shared/src/logger/Logger");
const electron_1 = require("electron");
const DeterminateProgressBar_1 = require("../ui/progress_bar/DeterminateProgressBar");
const RestartForUpdateButtons_1 = require("./RestartForUpdateButtons");
const log = Logger_1.Logger.create();
class UpdatesController {
    start() {
        if (electron_1.ipcRenderer) {
            electron_1.ipcRenderer.on('app-update:download-progress', (event, progress) => {
                this.onProgressInfo(progress);
            });
            electron_1.ipcRenderer.on('app-update:update-downloaded', () => {
                this.onUpdateDownloaded();
            });
        }
    }
    onProgressInfo(progress) {
        const percent = Math.floor(progress.percent);
        DeterminateProgressBar_1.DeterminateProgressBar.update(percent);
    }
    onUpdateDownloaded() {
        RestartForUpdateButtons_1.RestartForUpdateButtons.create();
    }
}
exports.UpdatesController = UpdatesController;
//# sourceMappingURL=UpdatesController.js.map