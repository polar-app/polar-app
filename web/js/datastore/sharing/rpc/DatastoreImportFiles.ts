import {JSONRPC} from './JSONRPC';
import {Backend} from '../../Backend';
import {FileRef} from "../../FileRef";

export class DatastoreImportFiles {

    public static async exec(request: DatastoreImportFileRequest): Promise<void> {
        return await JSONRPC.exec('datastoreImportFile', request);
    }

}

interface DatastoreImportFileRequest {
    readonly docID: string;
    readonly backend: Backend;
    readonly fileRef: FileRef;
}
