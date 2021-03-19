import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {AddFileRequest} from './AddFileRequest';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {isPresent} from 'polar-shared/src/Preconditions';
import {Reducers} from 'polar-shared/src/util/Reducers';

export namespace AddFileRequests {

    export function fromURL(url: string): AddFileRequest {

        const toBasename = (input: string): string => {
            input = input.replace( /[?#].*$/, '');
            return FilePaths.basename(input);
        };

        // compute a sane basename

        const parsedURL = new URL(url);

        const basenames = [];

        if (parsedURL.searchParams.get('url')) {
            basenames.push(toBasename(parsedURL.searchParams.get('url')!));
        }

        basenames.push(toBasename(url));

        const basename =
            basenames.filter(current => isPresent(current))
                     .reduce(Reducers.FIRST);

        return {
            docPath: url,
            basename
        };

    }

    export function fromPath(path: string): AddFileRequest {

        return {
            docPath: path,
            basename: FilePaths.basename(path)
        };

    }

    export function computeDirectly(event: DragEvent): AddFileRequest[] {

        if (event.dataTransfer && event.dataTransfer.files) {
            return computeFromFileList(Array.from(event.dataTransfer.files));
        } else {
            return [];
        }

    }

    function isFileSupported(name: string) {
        return FilePaths.hasExtension(name, 'pdf') || FilePaths.hasExtension(name, 'epub')
    }

    export function computeFromFileList(files: ReadonlyArray<File>): AddFileRequest[] {

        function toAddFileRequest(file: File): AddFileRequest {

            if (file.path) {

                // On Electron we have the file path directly.
                return {
                    docPath: file.path,
                    basename: FilePaths.basename(file.path)
                };

            } else {

                // https://developer.mozilla.org/en-US/docs/Web/API/URL/createObjectURL

                return {
                    docPath: URL.createObjectURL(file),
                    basename: file.name,
                };
            }

        }

        return Array.from(files)
            .filter(file => isFileSupported(file.name))
            .map(toAddFileRequest);

    }

    export async function computeRecursively(event: DragEvent): Promise<Optional<AddFileRequest[]>> {

        // if (AppRuntime.isElectron()) {
        //
        //     if (event.dataTransfer) {
        //
        //         // TODO: I don't like embedding the UI component in here
        //         // directly...
        //
        //         const progressToaster = await ProgressToasters.create();
        //
        //         try {
        //
        //             // the aborter will just throw an exception if the timeout
        //             // exceeds and the caller should show an error.
        //             const aborter = Aborters.maxTime(MAX_RECURSIVE_DIRECTORY_SCAN_DURATION);
        //
        //             const paths = Array.from(event.dataTransfer.files)
        //                 .map(file => file.path);
        //
        //             const acceptedFiles: PathStr[] = [];
        //
        //             for (const path of paths) {
        //
        //                 if (await Files.fileType(path) === 'directory') {
        //
        //                     await Files.recursively(path, async newPath => {
        //
        //                         if (isFileSupported(newPath.toLocaleLowerCase())) {
        //                             acceptedFiles.push(newPath);
        //                         }
        //
        //                         progressToaster.update({
        //                             title: `Finding files (${acceptedFiles.length}): `,
        //                             status: newPath
        //                         });
        //
        //                     }, aborter);
        //
        //                 }
        //
        //             }
        //
        //             const addFileRequests =
        //                 acceptedFiles.map(current => {
        //                     return {
        //                         docPath: current,
        //                         basename: FilePaths.basename(current)
        //                     };
        //                 });
        //
        //             return Optional.of(addFileRequests);
        //
        //         } finally {
        //
        //             setTimeout(() => progressToaster.destroy(), TOASTER_DESTROY_DELAY);
        //
        //         }
        //
        //     }
        //
        // }

        return Optional.empty();

    }

}

