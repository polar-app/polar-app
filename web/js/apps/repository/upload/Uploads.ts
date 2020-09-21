import {UploadFilters} from "./UploadFilters";
import {IUpload} from "./IUpload";

export namespace Uploads {

    export function fromFiles(files: FileList | ReadonlyArray<File> | null) {

        function toUpload(file: File): IUpload {

            return {
                blob: file,
                name: file.name,
                // relativePath: file.webkitRelativePath
            };
        }

        files = Array.from(files || []);
        return files.filter(UploadFilters.filterByDocumentType)
                             .map(toUpload);

    }
}

