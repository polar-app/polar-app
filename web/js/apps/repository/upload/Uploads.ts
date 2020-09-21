import {UploadFilters} from "./UploadFilters";
import {IUpload} from "./IUpload";
import {isPresent} from "polar-shared/src/Preconditions";
import {UploadPaths} from "./UploadPaths";
import {Tag, Tags} from "polar-shared/src/tags/Tags";
import {IWebkitFileSystem} from "./IWebkitFileSystem";
import {FileSystemFileEntries} from "./FileSystemFileEntries";
import {asyncStream} from "polar-shared/src/util/AsyncArrayStreams";

export namespace Uploads {

    import IWebkitFileSystemFileEntry = IWebkitFileSystem.IWebkitFileSystemFileEntry;

    interface FileWithWebkitRelativePath extends File {
        readonly webkitRelativePath: string;
    }

    function isFileWithWebkitRelativePath(file: File): file is FileWithWebkitRelativePath {
        return isPresent((<any> file).webkitRelativePath);
    }

    export async function fromFileSystemEntries(entries: ReadonlyArray<IWebkitFileSystemFileEntry>) {

        async function toUpload(entry: IWebkitFileSystemFileEntry): Promise<IUpload> {

            const asyncEntry = FileSystemFileEntries.toAsync(entry);

            function computeTags() {

                if (! entry.fullPath) {
                    return undefined;
                }

                const path = UploadPaths.parse(entry.fullPath);

                return [
                    Tags.create('/' + path)
                ];

            }

            const tags = computeTags();
            const file = await asyncEntry.file();

            return {
                blob: file,
                name: entry.name,
                tags
            };

        }

        return await asyncStream(entries)
            .filter(UploadFilters.filterByDocumentName)
            .map(toUpload)
            .collect();

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

