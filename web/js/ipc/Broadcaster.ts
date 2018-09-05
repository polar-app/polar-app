
import {BrowserWindow, ipcMain} from 'electron';
import {Logger} from '../logger/Logger';
import {Broadcasters} from './Broadcasters';
import {BrowserWindowReference} from '../ui/dialog_window/BrowserWindowReference';

const log = Logger.create();

/**
 * When we receive a message, we broadcast it to all the renderers.  Anyone not
 * listening just drops the message.  This makes it easy to implement various
 * forms of message communication.
 */
export class Broadcaster {

    private channel: string;

    /**
     *
     * @param channel The channel of the event we're listening to and going to broadcast.
     */
    constructor(channel: string) {

        this.channel = channel;

        ipcMain.on(channel, (event: Electron.Event, arg: any) => {

            log.info("Forwarding message: " , channel, event);

            const senderBrowserWindowReference
                = new BrowserWindowReference(BrowserWindow.fromWebContents(event.sender).id);

            Broadcasters.send(channel, arg, senderBrowserWindowReference);

        });

    }

}
