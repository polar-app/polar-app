import {dialog} from 'electron';
import {autoUpdater, UpdateInfo} from 'electron-updater';
import {ProgressInfo} from "builder-util-runtime";
import {Logger} from '../logger/Logger';

import process from 'process';
import {Broadcasters} from '../ipc/Broadcasters';
import {Version} from '../util/Version';
import {AppUpdate} from './AppUpdate';

const ENABLE_AUTO_UPDATE = true;

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

    const options = {
        type: 'info',
        title: 'Found Updates',
        message,
        buttons: ['Yes', 'No']
    };

    dialog.showMessageBox(options, (buttonIndex) => {

        if (buttonIndex === 0) {

            autoUpdater.downloadUpdate()
                .then(async () => {

                    log.info("Updated downloaded.");

                })
                .catch(err => log.error("Error handling updates: " + err));

        } else {

            if (updater) {
                updater!.enabled = true;
                updater = null;
            }

        }

    });


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

if (ENABLE_AUTO_UPDATE) {
    log.info("Auto updates enabled");
    autoUpdater.checkForUpdatesAndNotify();
}
