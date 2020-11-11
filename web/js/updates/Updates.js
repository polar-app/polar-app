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
exports.Updates = void 0;
const electron_1 = require("electron");
const electron_updater_1 = require("electron-updater");
const Logger_1 = require("polar-shared/src/logger/Logger");
const process_1 = __importDefault(require("process"));
const Broadcasters_1 = require("../ipc/Broadcasters");
const Version_1 = require("polar-shared/src/util/Version");
const ToasterMessages_1 = require("../ui/toaster/ToasterMessages");
const Toaster_1 = require("../ui/toaster/Toaster");
const TimeDurations_1 = require("polar-shared/src/util/TimeDurations");
const AppUpdates_1 = require("./AppUpdates");
const ENABLE_AUTO_UPDATE = true;
const RANDOM_DELAY = TimeDurations_1.TimeDurations.toRandom('3d');
const AUTO_UPDATE_DELAY_INITIAL = RANDOM_DELAY;
const AUTO_UPDATE_DELAY_RECHECK = RANDOM_DELAY;
const log = Logger_1.Logger.create();
electron_updater_1.autoUpdater.autoDownload = false;
electron_updater_1.autoUpdater.allowPrerelease = process_1.default.env.POLAR_AUTO_UPDATER_ALLOW_PRERELEASE === 'true';
log.info("Allowing pre-releases for auto-updates: " + electron_updater_1.autoUpdater.allowPrerelease);
class Updates {
    static checkForUpdates(menuItem) {
        if (this.performingUpdate) {
            return;
        }
        updater = menuItem;
        updater.enabled = false;
        this.checkForUpdatesManually();
    }
    static checkForUpdatesManually() {
        if (this.performingUpdate) {
            return;
        }
        log.info("Checking for updates manually.");
        Updates.updateRequestedManually = true;
        this.doCheckForUpdates()
            .catch(err => log.error("Error handling updates: " + err));
    }
    static scheduleAutoUpdate(delay = AUTO_UPDATE_DELAY_RECHECK) {
        log.info("Scheduling auto update for N ms: " + delay);
        setTimeout(() => this.doAutoUpdate(), delay);
    }
    static doAutoUpdate() {
        log.info("Checking for updates...");
        this.doCheckForUpdates()
            .then((updateCheckResult) => {
            log.info("Update result: ", updateCheckResult);
            this.scheduleAutoUpdate();
        })
            .catch(err => {
            log.error("Failed to check for updates: ", err);
            this.scheduleAutoUpdate();
        });
    }
    static doCheckForUpdates() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.performingUpdate) {
                log.warn("Update already running. Skipping.");
                return undefined;
            }
            return yield electron_updater_1.autoUpdater.checkForUpdates();
        });
    }
    static hasUpdated() {
        return this.updatedVersion !== undefined;
    }
    static quitAndInstall() {
        electron_updater_1.autoUpdater.quitAndInstall();
    }
}
exports.Updates = Updates;
Updates.updateRequestedManually = false;
Updates.performingUpdate = false;
let updater;
electron_updater_1.autoUpdater.on('checking-for-update', (info) => {
    Updates.performingUpdate = true;
});
electron_updater_1.autoUpdater.on('error', (error) => {
    log.info('update error:', error);
    ToasterMessages_1.ToasterMessages.send({
        type: Toaster_1.ToasterMessageType.ERROR,
        message: 'Error: ' + error == null ? "unknown" : (error.stack || error).toString()
    });
    Updates.updateRequestedManually = false;
    Updates.performingUpdate = false;
});
electron_updater_1.autoUpdater.on('update-cancelled', (info) => {
    log.info('update-cancelled');
    Updates.performingUpdate = false;
});
electron_updater_1.autoUpdater.on('update-available', (info) => {
    try {
        log.info("update-available: ", info);
        if (info && info.version) {
            const fromVersion = Version_1.Version.get();
            const toVersion = info.version;
            if (Updates.updatedVersion === toVersion) {
                log.warn(`Already updated to version ${toVersion} (not re-downloading)`);
                return;
            }
            Updates.updatedVersion = toVersion;
            const appUpdate = {
                fromVersion,
                toVersion,
                automatic: !Updates.updateRequestedManually
            };
            Broadcasters_1.Broadcasters.send("app-update:available", appUpdate);
            ToasterMessages_1.ToasterMessages.send({
                type: Toaster_1.ToasterMessageType.INFO,
                message: `Downloading app update to version ${toVersion}`
            });
            log.info("Downloading update: " + toVersion, info);
        }
        electron_updater_1.autoUpdater.downloadUpdate()
            .then(() => __awaiter(void 0, void 0, void 0, function* () {
            log.info("Update downloaded.");
        }))
            .catch(err => log.error("Error handling updates: " + err));
    }
    finally {
        Updates.updateRequestedManually = false;
    }
});
electron_updater_1.autoUpdater.on('update-not-available', () => {
    log.info('update-not-available');
    if (Updates.updateRequestedManually) {
        ToasterMessages_1.ToasterMessages.send({
            type: Toaster_1.ToasterMessageType.INFO,
            title: 'No update available',
            message: 'The current version of Polar is up-to-date',
            options: {
                requiresAcknowledgment: true,
                preventDuplicates: true
            }
        });
        if (updater) {
            updater.enabled = true;
            updater = null;
        }
    }
    Updates.updateRequestedManually = false;
});
electron_updater_1.autoUpdater.on('update-downloaded', () => {
    log.info('update-downloaded');
    Broadcasters_1.Broadcasters.send("app-update:update-downloaded", { status: true });
    Updates.updateRequestedManually = false;
    Updates.performingUpdate = false;
});
electron_updater_1.autoUpdater.on('download-progress', (progress) => {
    log.info(`Auto update download progress: ${progress.percent}. `, progress);
    Broadcasters_1.Broadcasters.send("app-update:download-progress", progress);
    Broadcasters_1.Broadcasters.send("download-progress", progress);
});
electron_1.ipcMain.on('app-update:check-for-update', () => {
    Updates.checkForUpdatesManually();
});
electron_1.ipcMain.on('app-update:quit-and-install', () => {
    electron_updater_1.autoUpdater.quitAndInstall();
});
if (ENABLE_AUTO_UPDATE && AppUpdates_1.AppUpdates.platformSupportsUpdates()) {
    log.info("Auto updates enabled.");
    Updates.scheduleAutoUpdate(AUTO_UPDATE_DELAY_INITIAL);
}
else {
    log.info("Auto updates disabled.");
}
//# sourceMappingURL=Updates.js.map