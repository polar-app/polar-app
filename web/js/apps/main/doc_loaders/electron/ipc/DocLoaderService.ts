import {MainAppController} from '../../../MainAppController';
import {LoadDocRequest} from "../../LoadDocRequest";
import {FilePaths} from "polar-shared/src/util/FilePaths";
import {Directories} from "../../../../../datastore/Directories";
import {Logger} from "polar-shared/src/logger/Logger";
import {ipcMain} from 'electron';

const log = Logger.create();

export class DocLoaderService {

    private readonly mainAppController: MainAppController;
    private readonly directories = new Directories();

    constructor(mainAppController: MainAppController) {
        this.mainAppController = mainAppController;
    }

    public start(): void {

        ipcMain.on('load-doc-request', (event: Electron.Event, loadDocRequest: LoadDocRequest) => {

            const path = FilePaths.join(this.directories.stashDir, loadDocRequest.backendFileRef.name);
            const {fingerprint} = loadDocRequest;

            this.mainAppController.handleLoadDoc(path, fingerprint, loadDocRequest.newWindow)
                .catch(err => log.error("Unable to load doc: ", err));

        });

    }

}

