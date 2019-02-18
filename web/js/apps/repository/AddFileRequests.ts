import {FileImportRequest} from './FileImportRequest';
import {FilePaths} from '../../util/FilePaths';
import {AddFileRequest} from './AddFileRequest';

export class AddFileRequests {

    public static fromPath(path: string): AddFileRequest {

        return {
            docPath: path,
            basename: FilePaths.basename(path)
        };

    }

}
