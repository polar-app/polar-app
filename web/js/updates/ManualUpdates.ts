import {dialog} from 'electron';
import { autoUpdater } from 'electron-updater';
import {Logger} from '../logger/Logger';

// borrowed from here and ported to typescript:
//
// https://github.com/electron-userland/electron-builder/blob/docs/encapsulated%20manual%20update%20via%20menu.js

const log = Logger.create();

autoUpdater.autoDownload = false;

export class ManualUpdates {

    // export this to MenuItem click callback
    public static checkForUpdates(menuItem: Electron.MenuItem) {
        updater = menuItem;
        updater.enabled = false;
        autoUpdater.checkForUpdates()
            .catch(err => log.error("Error handling updates: " + err ))
    }

}

let updater: Electron.MenuItem | null;

autoUpdater.on('error', (error) => {
    dialog.showErrorBox('Error: ', error == null ? "unknown" : (error.stack || error).toString())
});

autoUpdater.on('update-available', () => {

    const options = {
        type: 'info',
        title: 'Found Updates',
        message: 'Found updates, do you want update now?',
        buttons: ['Yes', 'No']
    };

    dialog.showMessageBox(options, (buttonIndex) => {

        if (buttonIndex === 0) {

            autoUpdater.downloadUpdate()
                .catch(err => log.error("Error handling updates: " + err ));

        } else {
            updater!.enabled = true;
            updater = null;
        }

    });

});

autoUpdater.on('update-not-available', () => {

    const options = {
        title: 'No Updates',
        message: 'Current version is up-to-date.'
    };

    dialog.showMessageBox(options);
    updater!.enabled = true;
    updater = null;

});

autoUpdater.on('update-downloaded', () => {

    const options = {
        title: 'Install Updates',
        message: 'Updates downloaded, application will be quit for update...'
    };

    dialog.showMessageBox(options, () => {
        setImmediate(() => autoUpdater.quitAndInstall());
    });

});

