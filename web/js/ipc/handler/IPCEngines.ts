import {ElectronRendererPipe} from '../pipes/ElectronRendererPipe';
import {ElectronIPCPipe} from './ElectronIPCPipe';
import {IPCRegistry} from './IPCRegistry';
import {IPCEngine} from './IPCEngine';

export class IPCEngines {

    public static renderer() {

        let electronRendererPipe = new ElectronRendererPipe();
        let ipcPipe = new ElectronIPCPipe(electronRendererPipe);

        let ipcRegistry = new IPCRegistry();

        return new IPCEngine(ipcPipe, ipcRegistry);

    }

}
