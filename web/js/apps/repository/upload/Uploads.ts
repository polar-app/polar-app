import {UploadFilters} from "./UploadFilters";
import {IUpload} from "./IUpload";
import {isPresent} from "polar-shared/src/Preconditions";
import {UploadPaths} from "./UploadPaths";
import {Tag, Tags} from "polar-shared/src/tags/Tags";

export namespace Uploads {

    interface FileWithWebkitRelativePath extends File {
        readonly webkitRelativePath: string;
    }

    function isFileWithWebkitRelativePath(file: File): file is FileWithWebkitRelativePath {
        return isPresent((<any> file).webkitRelativePath);
    }

    export function fromFiles(files: FileList | ReadonlyArray<File> | null) {

        function toUpload(file: File): IUpload {

            function computeRelativePath(): string | undefined {

                if (isFileWithWebkitRelativePath(file)) {
                    return file.webkitRelativePath;
                }

                return undefined;

            }

            function computeTags(): ReadonlyArray<Tag> | undefined {
                const relativePath = computeRelativePath();

                if (relativePath) {

                    const path = UploadPaths.parse(relativePath);

                    return [
                        Tags.create('/' + path)
                    ];

                }
                return undefined;

            }

            const tags = computeTags();

            return {
                blob: file,
                name: file.name,
                tags
            };

        }

        files = Array.from(files || []);
        return files.filter(UploadFilters.filterByDocumentType)
                             .map(toUpload);

    }
}

