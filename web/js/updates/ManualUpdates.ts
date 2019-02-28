import {dialog} from 'electron';
import {autoUpdater, UpdateInfo} from 'electron-updater';
import {ProgressInfo} from "builder-util-runtime";
import {Logger} from '../logger/Logger';

import process from 'process';
import {Broadcasters} from '../ipc/Broadcasters';
import {Version} from '../util/Version';
import {AppUpdate} from './AppUpdate';
import {ToasterMessages} from '../ui/toaster/ToasterMessages';
import {ToasterMessageType} from '../ui/toaster/Toaster';

const ENABLE_AUTO_UPDATE = true;

const AUTO_UPDATE_DELAY_INITIAL = 2 * 60 * 1000;
const AUTO_UPDATE_DELAY_RECHECK = 60 * 60 * 1000;

// borrowed from here and ported to typescript:
//
// https://github.com/electron-userland/electron-builder/blob/docs/encapsulated%20manual%20update%20via%20menu.js

const log = Logger.create();

autoUpdater.autoDownload = true;

// this is so that we can
autoUpdater.allowPrerelease = process.env.POLAR_AUTO_UPDATER_ALLOW_PRERELEASE === 'true';

log.info("Allowing pre-releases for auto-updates: " + autoUpdater.allowPrerelease);

export class ManualUpdates {

    public static updateRequestedManually: boolean = false;

    // export this to MenuItem click callback
    public static checkForUpdates(menuItem: Electron.MenuItem) {

        ManualUpdates.updateRequestedManually = true;

        updater = menuItem;
        updater.enabled = false;
        autoUpdater.checkForUpdates()
            .catch(err => log.error("Error handling updates: " + err ));

    }

}

let updater: Electron.MenuItem | null;

autoUpdater.on('error', (error) => {

    log.info('update error:', error);

    if (ManualUpdates.updateRequestedManually) {
        dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString());
    }

    ManualUpdates.updateRequestedManually = false;

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
            automatic: ! ManualUpdates.updateRequestedManually
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

    if (ManualUpdates.updateRequestedManually) {

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

    ManualUpdates.updateRequestedManually = false;

});

autoUpdater.on('update-not-available', () => {

    log.info('update-not-available');

    if (ManualUpdates.updateRequestedManually) {

        const options = {
            title: 'No Updates',
            message: 'Current version is up-to-date.'
        };

        dialog.showMessageBox(options);
        updater!.enabled = true;
        updater = null;

    }

    ManualUpdates.updateRequestedManually = false;

});

autoUpdater.on('update-downloaded', () => {

    log.info('update-downloaded');

    if (ManualUpdates.updateRequestedManually) {

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

    ManualUpdates.updateRequestedManually = false;

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

function scheduleAutoUpdate(delay: number = AUTO_UPDATE_DELAY_RECHECK) {

    log.info("Scheduling auto update for N ms: " + delay);

    setTimeout(() => doAutoUpdate(), delay);

}

function doAutoUpdate() {

    log.info("Checking for updates...");

    autoUpdater.checkForUpdates()
        .then((updateCheckResult) => {
            log.info("Update result: ", updateCheckResult);
            scheduleAutoUpdate();
        })
        .catch(err => {
            log.error("Failed to check for updates: ", err);
            scheduleAutoUpdate();
        });

}

if (ENABLE_AUTO_UPDATE) {
    log.info("Auto updates enabled.");

    scheduleAutoUpdate(AUTO_UPDATE_DELAY_INITIAL);
}
