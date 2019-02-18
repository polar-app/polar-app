import {FilePaths} from '../../util/FilePaths';
import {FileImportRequest} from './FileImportRequest';
import {AddFileRequests} from './AddFileRequests';

export class FileImportRequests {

    public static fromPath(path: string): FileImportRequest {

        return {
            files: [
                AddFileRequests.fromPath(path)
            ]
        };

    }

    public static fromPaths(paths: string[]): FileImportRequest {

        const files = paths.map(path => AddFileRequests.fromPath(path));

        return {
            files
        };

    }


}
