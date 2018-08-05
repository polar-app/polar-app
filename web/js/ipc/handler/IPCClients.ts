import {IPCClient} from './IPCClient';
import {ElectronIPCPipe} from './ElectronIPCPipe';
import {ElectronMainReadablePipe} from '../pipes/ElectronMainReadablePipe';
import {ElectronRendererPipe} from '../pipes/ElectronRendererPipe';

export class IPCClients {

    static mainProcess() {
        return new IPCClient(new ElectronIPCPipe(new ElectronMainReadablePipe()));
    }

    static rendererProcess() {
        return new IPCClient(new ElectronIPCPipe(new ElectronRendererPipe()));
    }

}
