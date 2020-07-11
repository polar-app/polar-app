import {MainAppController} from '../../../MainAppController';
import {Logger} from "polar-shared/src/logger/Logger";
import {ipcMain} from 'electron';
import {ILoadBrowserWindowRequest} from '../ElectronDocLoader';

const log = Logger.create();

/**
 * @Deprecated now using this code in polar-desktop-app
 */
export class DocLoaderService {

    private readonly mainAppController: MainAppController;

    constructor(mainAppController: MainAppController) {
        this.mainAppController = mainAppController;
    }

    public start(): void {

        ipcMain.on('load-browser-window-request', (event: Electron.Event, request: ILoadBrowserWindowRequest) => {

            const {url, newWindow} = request;

            this.mainAppController.handleLoadDoc(url, newWindow)
                .catch(err => log.error("DocLoaderService: Unable to load doc: ", err));

        });

    }

}

