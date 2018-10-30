import {ipcRenderer} from "electron";
import {FileImportRequest} from '../main/MainAppController';
import {Broadcasters} from "../../ipc/Broadcasters";

/**
 * Code to send message to the FileImportController on the channel it expects.
 *
 */
export class FileImportClient {

    public static send(fileImportRequest: FileImportRequest) {

        Broadcasters.send('file-import', fileImportRequest);

    }

}
