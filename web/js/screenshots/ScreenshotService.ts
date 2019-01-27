import {IPCEngines} from '../ipc/handler/IPCEngines';
import {ScreenshotHandler} from './ScreenshotHandler';

/**
 * Service that runs in the Electron main context which listens to IPC events
 * and performs screenshots on windows when requested.
 *
 * The ScreenshotsService must be started in the main process or messages will
 * never be returned.
 *
 * @ElectronMainContext - Must be run from the electron main context.
 */
export class ScreenshotService {

    constructor() {
    }

    start() {

        let ipcEngine = IPCEngines.mainProcess();

        ipcEngine.registry.registerPath('/screenshots/create-screenshot', new ScreenshotHandler());

        ipcEngine.start();

    }

}
