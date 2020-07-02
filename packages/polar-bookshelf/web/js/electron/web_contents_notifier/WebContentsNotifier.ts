import {ipcMain} from 'electron';
import {WindowChannels} from './WindowChannels';
import WebContents = Electron.WebContents;
import {IPCMainPromises, MainIPCEvent, MainIPCEventListener} from '../framework/IPCMainPromises';

/**
 * A UINotifier allows main to wait for an event in the UI triggered by the
 * user.  The events are dispatched between main and a specific renderer and
 * act as a simple channel so that main can create a browser, and know which
 * events it's receiving from specific windows.
 *
 * @ElectronMainContext
 */
export class WebContentsNotifier {

    public static on<M>(webContents: WebContents,
                        channel: string,
                        listener: MainIPCEventListener<M>) {

        const windowChannel = WindowChannels.create(webContents, channel);
        IPCMainPromises.on(windowChannel, listener);

    }

    public static once<M>(webContents: WebContents, channel: string): Promise<MainIPCEvent<M>> {

        const windowChannel = WindowChannels.create(webContents, channel);

        return IPCMainPromises.once(windowChannel);

    }

}
