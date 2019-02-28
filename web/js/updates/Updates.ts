import {dialog} from 'electron';
import {autoUpdater, UpdateInfo, UpdateCheckResult} from 'electron-updater';
import {ProgressInfo} from "builder-util-runtime";
import {Logger} from '../logger/Logger';

import process from 'process';
import {Broadcasters} from '../ipc/Broadcasters';
import {Version} from '../util/Version';
import {AppUpdate} from './AppUpdate';
import {ToasterMessages} from '../ui/toaster/ToasterMessages';
import {ToasterMessageType} from '../ui/toaster/Toaster';
import {TimeDurations} from '../util/TimeDurations';
import {Platform, Platforms} from '../util/Platforms';
import {DistConfig} from '../dist_config/DistConfig';

const ENABLE_AUTO_UPDATE = true;

const MIN_UPDATE_DELAY = TimeDurations.toRandom('3d');

const AUTO_UPDATE_DELAY_INITIAL = TimeDurations.toMillis('2m');
const AUTO_UPDATE_DELAY_RECHECK = TimeDurations.toMillis('1h');

// borrowed from here and ported to typescript:
//
// https://github.com/electron-userland/electron-builder/blob/docs/encapsulated%20manual%20update%20via%20menu.js

const log = Logger.create();

autoUpdater.autoDownload = true;

// this is so that we can
autoUpdater.allowPrerelease = process.env.POLAR_AUTO_UPDATER_ALLOW_PRERELEASE === 'true';

log.info("Allowing pre-releases for auto-updates: " + autoUpdater.allowPrerelease);

export class Updates {

    public static updateRequestedManually: boolean = false;

    public static performingUpdate: boolean = false;

    // export this to MenuItem click callback
    public static checkForUpdates(menuItem: Electron.MenuItem) {

        Updates.updateRequestedManually = true;

        if (this.performingUpdate) {
            return;
        }

        updater = menuItem;
        updater.enabled = false;
        this.doCheckForUpdates()
            .catch(err => log.error("Error handling updates: " + err ));

    }

    public static scheduleAutoUpdate(delay: number = AUTO_UPDATE_DELAY_RECHECK) {

        log.info("Scheduling auto update for N ms: " + delay);

        setTimeout(() => this.doAutoUpdate(), delay);

    }

    public static doAutoUpdate() {

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

    public static async doCheckForUpdates(): Promise<UpdateCheckResult | undefined> {

        if (this.performingUpdate) {
            log.warn("Update already running. Skipping.");
            return undefined;
        }

        return await autoUpdater.checkForUpdates();

    }

    public static platformSupportsUpdates() {

        return [Platform.MACOS, Platform.WINDOWS].includes(Platforms.get()) && DistConfig.ENABLE_UPDATES;

    }

}

let updater: Electron.MenuItem | null;

// export declare type UpdaterEvents = "login" | "checking-for-update" | "update-available" | "update-cancelled" | "download-progress" | "update-downloaded" | "error";


autoUpdater.on('checking-for-update', (info: UpdateInfo) => {
    Updates.performingUpdate = true;
});

autoUpdater.on('error', (error) => {

    log.info('update error:', error);

    if (Updates.updateRequestedManually) {
        dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString());
    }

    Updates.updateRequestedManually = false;

    Updates.performingUpdate = false;

});

autoUpdater.on('update-cancelled', (info: UpdateInfo) => {
    log.info('update-cancelled');
    Updates.performingUpdate = false;
});

autoUpdater.on('update-available', (info: UpdateInfo) => {

    log.info("update-available: ", info);

    let message = 'Found updates, do you want update now?';

    if (info && info.version) {
        const fromVersion = Version.get();
        const toVersion = info.version;
        message = `Found updates, do you want update from ${fromVersion} to ${toVersion} now?`;

        const appUpdate: AppUpdate = {
            fromVersion,
            toVersion,
            automatic: ! Updates.updateRequestedManually
        };

        Broadcasters.send("app-update:available", appUpdate);

    }

    const doUpdate = () => {

        autoUpdater.downloadUpdate()
            .then(async () => {

                log.info("Updated downloaded.");

            })
            .catch(err => log.error("Error handling updates: " + err));

    };

    if (Updates.updateRequestedManually) {

        const options = {
            type: 'info',
            title: 'Found Updates',
            message,
            buttons: ['Yes', 'No']
        };

        dialog.showMessageBox(options, (buttonIndex) => {

            if (buttonIndex === 0) {

                doUpdate();

            } else {

                if (updater) {
                    updater!.enabled = true;
                    updater = null;
                }

            }

        });

    } else {
        doUpdate();
    }

    Updates.updateRequestedManually = false;

});

autoUpdater.on('update-not-available', () => {

    log.info('update-not-available');

    if (Updates.updateRequestedManually) {

        const options = {
            title: 'No Updates',
            message: 'Current version is up-to-date.'
        };

        dialog.showMessageBox(options);
        updater!.enabled = true;
        updater = null;

    }

    Updates.updateRequestedManually = false;

});

autoUpdater.on('update-downloaded', () => {

    log.info('update-downloaded');

    if (Updates.updateRequestedManually) {

        const options = {
            title: 'Install Updates',
            message: 'Updates downloaded, application will be quit for update...'
        };

        dialog.showMessageBox(options, () => {
            setImmediate(() => autoUpdater.quitAndInstall());
        });

    } else {

        ToasterMessages.send({
            type: ToasterMessageType.SUCCESS,
            title: 'Update downloaded',
            message: 'A new update for Polar was downloaded.  Please restart Polar to apply update.',
            options: {
                requiresAcknowledgment: true,
                preventDuplicates: true
            }
        });

    }

    Updates.updateRequestedManually = false;
    Updates.performingUpdate = false;

});

autoUpdater.on('download-progress', (progress: ProgressInfo) => {

    // ProgressBar

    // https://github.com/electron-userland/electron-builder/blob/docs/auto-update.md#event-download-progress
    // bytesPerSecond percent total transferred

    log.info(`Auto update download progress: ${progress.percent}. `, progress);

    // TODO: we're running in the main process here. We could use the IPC
    // broadcaster to send message to every renderer and have a controller
    // running there, listening for the messages on download progress updates
    // and then display the appropriate UI.

    Broadcasters.send("app-update:download-progress", progress);

    Broadcasters.send("download-progress", progress);

});

if (ENABLE_AUTO_UPDATE && Updates.platformSupportsUpdates()) {
    log.info("Auto updates enabled.");

    Updates.scheduleAutoUpdate(AUTO_UPDATE_DELAY_INITIAL);
} else {
    log.info("Auto updates disabled.");
}


