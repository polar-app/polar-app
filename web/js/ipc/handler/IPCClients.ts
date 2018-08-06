import {IPCClient} from './IPCClient';
import {ElectronIPCPipe} from './ElectronIPCPipe';
import {ElectronRendererPipe} from '../pipes/ElectronRendererPipe';
import {ElectronRenderToRendererPipe} from '../pipes/ElectronRenderToRendererPipe';
import {WindowReference} from '../../ui/dialog_window/WindowReference';
import {ElectronMainToBrowserWindowPipe} from '../pipes/ElectronMainToBrowserWindowPipe';
import {ElectronRendererContext} from './ElectronContext';

export class IPCClients {

    static rendererProcess() {
        return new IPCClient(new ElectronIPCPipe(new ElectronRendererPipe()));
    }

    static fromMainToRenderer(browserWindow: Electron.BrowserWindow) {
        return new IPCClient(new ElectronIPCPipe(new ElectronMainToBrowserWindowPipe(browserWindow)));
    }

    static fromRendererToRenderer(windowReference: WindowReference) {
        let targetContext = new ElectronRendererContext(windowReference);
        let electronRenderToRendererPipe = new ElectronRenderToRendererPipe(windowReference);
        let electronIPCPipe = new ElectronIPCPipe(electronRenderToRendererPipe);
        return new IPCClient(electronIPCPipe, targetContext);
    }

}
