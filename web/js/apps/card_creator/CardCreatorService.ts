import {ElectronMainReadablePipe} from '../../ipc/pipes/ElectronMainReadablePipe';
import {ElectronIPCPipe} from '../../ipc/handler/ElectronIPCPipe';
import {IPCRegistry} from '../../ipc/handler/IPCRegistry';
import {IPCEngine} from '../../ipc/handler/IPCEngine';

export class CardCreatorService {

    async start(): Promise<void> {

        let mainReadablePipe = new ElectronMainReadablePipe();
        let ipcPipe = new ElectronIPCPipe(mainReadablePipe);

        let ipcRegistry = new IPCRegistry();

        // ipcRegistry.registerPath('/api/annotations/flashcards/create',
        //     new GetParentWindowHandler(this.parentWindowRegistry));

        let ipcEngine = new IPCEngine(ipcPipe, ipcRegistry);

        ipcEngine.start();

    }

}
