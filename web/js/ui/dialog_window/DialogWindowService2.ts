import {Logger} from '../../logger/Logger';
import {ParentWindowRegistry} from './ParentWindowRegistry';
import {IPCEngine} from '../../ipc/handler/IPCEngine';
import {IPCRegistry} from '../../ipc/handler/IPCRegistry';
import {ElectronIPCPipe} from '../../ipc/handler/ElectronIPCPipe';
import {MainReadablePipe} from '../../ipc/pipes/MainReadablePipe';
import {GetParentWindowHandler} from './ipc/GetParentWindowHandler';
import {CreateWindowHandler} from './ipc/CreateWindowHandler';

const log = Logger.create();

/**
 *
 * Service that runs in the main process that responds to requests to create
 * dialog boxes hosting new apps.
 *
 * @MainContext
 */
export class DialogWindowService2 {

    private parentWindowRegistry: ParentWindowRegistry = new ParentWindowRegistry();

    start() {

        let mainReadablePipe = new MainReadablePipe();
        let ipcPipe = new ElectronIPCPipe(mainReadablePipe);

        let ipcRegistry = new IPCRegistry();

        ipcRegistry.registerPath('/api/dialog-window/get-parent',
                                 new GetParentWindowHandler(this.parentWindowRegistry));

        ipcRegistry.registerPath('/api/dialog-window/create-window',
                                 new CreateWindowHandler(this.parentWindowRegistry));

        let ipcEngine = new IPCEngine(ipcPipe, ipcRegistry);

        ipcEngine.start();

    }

}
