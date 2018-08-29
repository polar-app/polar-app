import {IPCEngines} from '../../../ipc/handler/IPCEngines';
import {LoadDocHandler} from './handlers/LoadDocHandler';
import {MainAppController} from '../MainAppController';

export class MainAppService {

    private readonly mainAppController: MainAppController;

    constructor(mainAppController: MainAppController) {
        this.mainAppController = mainAppController;
    }

    start(): void {

        let ipcEngine = IPCEngines.mainProcess();

        ipcEngine.registry.registerPath('/main/load-doc', new LoadDocHandler(this.mainAppController));

        ipcEngine.start();

    }

}
