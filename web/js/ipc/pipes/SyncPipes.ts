import BrowserWindow = Electron.BrowserWindow;
import {SyncPipe} from './SyncPipe';
import {ElectronMainToBrowserWindowPipe} from './ElectronMainToBrowserWindowPipe';
import {ElectronRendererPipe} from './ElectronRendererPipe';

export class SyncPipes {

    static fromMainToBrowserWindow(browserWindow: BrowserWindow, name: string) {
        return new SyncPipe(new ElectronMainToBrowserWindowPipe(browserWindow), 'main-to-browser-window', name);
    }

    static fromRendererToMain(name: string) {
        return new SyncPipe(new ElectronRendererPipe(), 'renderer', name);
    }

}
