import {FileImportRequest} from './FileImportRequest';
import {AddFileRequests} from './AddFileRequests';
import {PathStr} from "polar-shared/src/util/Strings";

export class FileImportRequests {

    public static fromPath(path: string): FileImportRequest {

        return {
            files: [
                AddFileRequests.fromPath(path)
            ]
        };

    }

    public static fromPaths(paths: ReadonlyArray<PathStr>): FileImportRequest {

        const files = paths.map(path => AddFileRequests.fromPath(path));

        return {
            files
        };

    }

    public static fromURLs(urls: string[]): FileImportRequest {

        const files = urls.map(url => AddFileRequests.fromURL(url));

        return {
            files
        };

    }

}
