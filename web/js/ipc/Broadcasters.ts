import {BrowserWindow} from "electron";

export class Broadcasters {

    /**
     * Send the given message, to the given channel, to all current
     * BrowserWindows.
     */
    public static send(channel: string, message: any) {

        let browserWindows = BrowserWindow.getAllWindows();
        browserWindows.forEach(window => {
            window.webContents.send(channel, message);
        });

    }

}
