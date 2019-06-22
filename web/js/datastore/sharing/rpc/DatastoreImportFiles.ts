import {JSONRPC} from './JSONRPC';
import {FileRef} from '../../Datastore';
import {Backend} from '../../Backend';

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
