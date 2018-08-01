import {Logger} from '../../logger/Logger';
import {ParentWindowRegistry} from './ParentWindowRegistry';
import {IPCEngine} from '../../ipc/handler/IPCEngine';
import {IPCRegistry} from '../../ipc/handler/IPCRegistry';
import {ElectronIPCPipe} from '../../ipc/handler/ElectronIPCPipe';
import {MainReadablePipe} from '../../ipc/pipes/MainReadablePipe';
import {GetParentWindowHandler} from './ipc/GetParentWindowHandler';
import {CreateWindowHandler} from './ipc/CreateWindowHandler';

const log = Logger.create();

const CHANNEL_NAME = 'dialog-window';

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

        ipcRegistry.register(new GetParentWindowHandler(this.parentWindowRegistry));
        ipcRegistry.register(new CreateWindowHandler(this.parentWindowRegistry));

        let ipcEngine = new IPCEngine(ipcPipe, CHANNEL_NAME, ipcRegistry);

        ipcEngine.start();

    }

}
