import {FileType} from './FileType';

export class FileTypes {

    public static create(path: string): FileType {

        if (path.endsWith(".pdf")) {
            return FileType.PDF;
        } else if (path.endsWith(".phz")) {
            return FileType.PHZ;
        } else {
            throw new Error("Unable to handle file: " + path);
        }

    }

}
