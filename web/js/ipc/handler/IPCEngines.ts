import {ElectronIPCPipe} from './ElectronIPCPipe';
import {IPCRegistry} from './IPCRegistry';
import {IPCEngine} from './IPCEngine';
import {ElectronMainReadablePipe} from '../pipes/ElectronMainReadablePipe';

export class IPCEngines {

    public static mainProcess() {

        let electronPipe = new ElectronMainReadablePipe();
        let ipcPipe = new ElectronIPCPipe(electronPipe);

        let ipcRegistry = new IPCRegistry();

        return new IPCEngine(ipcPipe, ipcRegistry);

    }

}
