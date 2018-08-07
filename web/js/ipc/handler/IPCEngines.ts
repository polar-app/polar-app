import {ElectronRendererPipe} from '../pipes/ElectronRendererPipe';
import {ElectronIPCPipe} from './ElectronIPCPipe';
import {IPCRegistry} from './IPCRegistry';
import {IPCEngine} from './IPCEngine';
import {ElectronMainReadablePipe} from '../pipes/ElectronMainReadablePipe';

export class IPCEngines {

    public static rendererProcess() {

        let electronPipe = new ElectronRendererPipe();
        let ipcPipe = new ElectronIPCPipe(electronPipe);

        let ipcRegistry = new IPCRegistry();

        return new IPCEngine(ipcPipe, ipcRegistry);

    }

    public static mainProcess() {

        let electronPipe = new ElectronMainReadablePipe();
        let ipcPipe = new ElectronIPCPipe(electronPipe);

        let ipcRegistry = new IPCRegistry();

        return new IPCEngine(ipcPipe, ipcRegistry);

    }

}
