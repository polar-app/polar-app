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
        let electronMainToBrowserWindowPipe = new ElectronMainToBrowserWindowPipe(browserWindow);
        let electronIPCPipe = new ElectronIPCPipe(electronMainToBrowserWindowPipe);

        let targetContext = new ElectronRendererContext(new WindowReference(browserWindow.id));
        return new IPCClient(electronIPCPipe, targetContext);

    }

    static fromRendererToRenderer(windowReference: WindowReference) {
        let electronRenderToRendererPipe = new ElectronRenderToRendererPipe(windowReference);
        let electronIPCPipe = new ElectronIPCPipe(electronRenderToRendererPipe);

        let targetContext = new ElectronRendererContext(windowReference);
        return new IPCClient(electronIPCPipe, targetContext);
    }

}
