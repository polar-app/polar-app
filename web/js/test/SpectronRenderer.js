const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;

class SpectronRenderer {

    /**
     *
     * @return {Promise<MainWindow>}
     */
    static start() {

        return new Promise(resolve => {

            console.log("Electron app started. Waiting for it to be ready.");

            app.on('ready', async function() {

                console.log("Ready!  Creating main window.");

                let mainWindow = new BrowserWindow();
                mainWindow.loadURL('about:blank')
                resolve(mainWindow);

            });

        })

    }

}

module.exports.SpectronRenderer = SpectronRenderer;
