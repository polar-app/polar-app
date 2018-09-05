import {IPCClient} from './IPCClient';
import {ElectronIPCPipe} from './ElectronIPCPipe';
import {ElectronRendererPipe} from '../pipes/ElectronRendererPipe';
import {ElectronRenderToRendererPipe} from '../pipes/ElectronRenderToRendererPipe';
import {BrowserWindowReference} from '../../ui/dialog_window/BrowserWindowReference';
import {ElectronMainToBrowserWindowPipe} from '../pipes/ElectronMainToBrowserWindowPipe';
import {ElectronRendererContext} from './ElectronContext';

export class IPCClients {

    static rendererProcess() {
        return new IPCClient(new ElectronIPCPipe(new ElectronRendererPipe()));
    }

    static fromMainToRenderer(browserWindow: Electron.BrowserWindow) {
        let electronMainToBrowserWindowPipe = new ElectronMainToBrowserWindowPipe(browserWindow);
        let electronIPCPipe = new ElectronIPCPipe(electronMainToBrowserWindowPipe);

        let targetContext = new ElectronRendererContext(new BrowserWindowReference(browserWindow.id));
        return new IPCClient(electronIPCPipe, targetContext);

    }

    static fromRendererToRenderer(windowReference: BrowserWindowReference) {
        let electronRenderToRendererPipe = new ElectronRenderToRendererPipe(windowReference);
        let electronIPCPipe = new ElectronIPCPipe(electronRenderToRendererPipe);

        let targetContext = new ElectronRendererContext(windowReference);
        return new IPCClient(electronIPCPipe, targetContext);
    }

}
