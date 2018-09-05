import {BrowserWindow} from "electron";
import {BrowserWindowReference} from '../ui/dialog_window/BrowserWindowReference';

export class Broadcasters {

    /**
     * Send the given message, to the given channel, to all current
     * BrowserWindows.
     */
    public static send(channel: string, message: any, ...excluding: BrowserWindowReference[]) {

        const excludingIDs = excluding.map(current => current.id);

        const browserWindows =
            BrowserWindow.getAllWindows()
                // now filter out the excluding windows so that we don't
                // re-broadcast to them.
                .filter(current => ! excludingIDs.includes(current.id));

        browserWindows.forEach((window) => {
            window.webContents.send(channel, message);
        });

    }

}
