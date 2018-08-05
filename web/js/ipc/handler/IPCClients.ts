import {IPCClient} from './IPCClient';
import {ElectronIPCPipe} from './ElectronIPCPipe';
import {ElectronRendererPipe} from '../pipes/ElectronRendererPipe';
import {ElectronRenderToRendererPipe} from '../pipes/ElectronRenderToRendererPipe';
import {WindowReference} from '../../ui/dialog_window/WindowReference';
import {ElectronMainToBrowserWindowPipe} from '../pipes/ElectronMainToBrowserWindowPipe';

export class IPCClients {

    static rendererProcess() {
        return new IPCClient(new ElectronIPCPipe(new ElectronRendererPipe()));
    }

    static fromMainToRenderer(browserWindow: Electron.BrowserWindow) {
        return new IPCClient(new ElectronIPCPipe(new ElectronMainToBrowserWindowPipe(browserWindow)));
    }

    static fromRendererToRenderer(windowReference: WindowReference) {
        return new IPCClient(new ElectronIPCPipe(new ElectronRenderToRendererPipe(windowReference)));
    }

}
