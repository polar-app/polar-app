import {FileType} from './FileType';
import {FilePaths} from 'polar-shared/src/util/FilePaths';

export class FileTypes {

    public static create(path: string): FileType {

        if (FilePaths.hasExtension(path, "pdf")) {
            return 'pdf';
        } else if (FilePaths.hasExtension(path, "epub")) {
            return 'epub';
        } else {
            throw new Error("Unable to handle file: " + path);
        }

    }

}
