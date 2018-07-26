import {app, BrowserWindow} from 'electron';

const BROWSER_OPTIONS = {
    backgroundColor: '#FFF',

    // NOTE: the default width and height shouldn't be changed here as it can
    // break unit tests.

    //width: 1000,
    //height: 1000,

    webPreferences: {
        webSecurity: false,
    }
};

/**
 * Code for reliably working with the main process in Spectron.
 */
export class SpectronMain {

    /**
     */
    static setup(): Promise<Electron.BrowserWindow> {

        return new Promise(resolve => {

            console.log("Electron app started. Waiting for it to be ready.");

            app.on('ready', async function() {

                console.log("Ready!  Creating main window!!");

                let mainWindow = new BrowserWindow(BROWSER_OPTIONS);
                mainWindow.loadURL('about:blank');
                resolve(mainWindow);

            });

        })

    }

}
