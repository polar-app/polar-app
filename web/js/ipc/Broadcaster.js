const electron = require('electron');
const ipcMain = electron.ipcMain;
const BrowserWindow = electron.BrowserWindow;

/**
 * When we receive a message, we broadcast it to all the renderers.  Anyone not
 * listening just drops the message.  This makes it easy to implement various
 * forms of message communication.
 */
class Broadcaster {

    /**
     *
     * @param name The name of the event we're listening to and going to broadcast.
     */
    constructor(name) {

        ipcMain.on(name, (event, arg) => {

            BrowserWindow.getAllWindows().forEach(window => {
                window.webContents.send(name, event, arg);
            });

        });

    }

}

module.exports.Broadcaster = Broadcaster;
