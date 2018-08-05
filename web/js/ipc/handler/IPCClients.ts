import {IPCClient} from './IPCClient';
import {ElectronIPCPipe} from './ElectronIPCPipe';
import {ElectronMainReadablePipe} from '../pipes/ElectronMainReadablePipe';
import {ElectronRendererPipe} from '../pipes/ElectronRendererPipe';
import {ElectronRenderToRendererPipe} from '../pipes/ElectronRenderToRendererPipe';
import {WindowReference} from '../../ui/dialog_window/WindowReference';
import {ElectronMainToRendererPipe} from '../pipes/ElectronMainToRendererPipe';

export class IPCClients {

    static mainProcess() {
        return new IPCClient(new ElectronIPCPipe(new ElectronMainReadablePipe()));
    }

    static rendererProcess() {
        return new IPCClient(new ElectronIPCPipe(new ElectronRendererPipe()));
    }

    static fromMainToRenderer(browserWindow: Electron.BrowserWindow) {
        return new IPCClient(new ElectronIPCPipe(new ElectronMainToRendererPipe(browserWindow)));
    }

    static toBrowserWindow(browserWindow: Electron.BrowserWindow) {
        return new IPCClient(new ElectronIPCPipe(new ElectronRenderToRendererPipe(new WindowReference(browserWindow.id))));
    }

}
