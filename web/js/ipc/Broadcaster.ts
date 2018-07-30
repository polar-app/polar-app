
import {BrowserWindow, ipcMain} from 'electron';

/**
 * When we receive a message, we broadcast it to all the renderers.  Anyone not
 * listening just drops the message.  This makes it easy to implement various
 * forms of message communication.
 */
class Broadcaster {

    private name: string;

    /**
     *
     * @param name The name of the event we're listening to and going to broadcast.
     */
    constructor(name: string) {
        this.name = name;

        ipcMain.on(name, (event: any, arg: any) => {

            console.log("Forwarding message: " , name, event);

            let browserWindows = BrowserWindow.getAllWindows();
            browserWindows.forEach(window => {
                window.webContents.send(name, arg);
            });

        });

    }

}

module.exports.Broadcaster = Broadcaster;
