import {FileImportRequest} from './FileImportRequest';
import {FilePaths} from '../../util/FilePaths';
import {AddFileRequest} from './AddFileRequest';
import {Optional} from '../../util/ts/Optional';
import {PathStr} from '../../util/Strings';
import {AppRuntime} from '../../AppRuntime';
import {ProgressToasters} from '../../ui/progress_toaster/ProgressToasters';
import {Aborters, Files} from '../../util/Files';

const TOASTER_DESTROY_DELAY = 500;
const MAX_RECURSIVE_DIRECTORY_SCAN_DURATION = "30s";

export class AddFileRequests {

    public static fromPath(path: string): AddFileRequest {

        return {
            docPath: path,
            basename: FilePaths.basename(path)
        };

    }

    public static computeDirectly(files: FileList): AddFileRequest[] {

        return Array.from(files)
            .filter(file => file.name.endsWith(".pdf"))
            .map(file => {

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

            });

    }

    /**
     * @ElectronRendererContext
     * @BrowserContext
     * @param event
     */
    public static async computeRecursively(event: DragEvent): Promise<Optional<AddFileRequest[]>> {

        if (AppRuntime.isElectron()) {

            if (event.dataTransfer) {

                // TODO: I don't like embedding the UI component in here
                // directly...

                const progressToaster = await ProgressToasters.create();

                try {

                    // the aborter will just throw an exception if the timeout
                    // exceeds and the caller should show an error.
                    const aborter = Aborters.maxTime(MAX_RECURSIVE_DIRECTORY_SCAN_DURATION);

                    const paths = Array.from(event.dataTransfer.files)
                        .map(file => file.path);

                    const acceptedFiles: PathStr[] = [];

                    for (const path of paths) {

                        if (await Files.fileType(path) === 'directory') {

                            await Files.recursively(path, async newPath => {

                                if (newPath.endsWith(".pdf")) {
                                    acceptedFiles.push(newPath);
                                }

                                progressToaster.update({
                                    title: `Finding files (${acceptedFiles.length}): `,
                                    status: newPath
                                });

                            }, aborter);

                        }

                    }

                    const addFileRequests =
                        acceptedFiles.map(current => {
                            return {
                                docPath: current,
                                basename: FilePaths.basename(current)
                            };
                        });

                    return Optional.of(addFileRequests);

                } finally {

                    setTimeout(() => progressToaster.destroy(), TOASTER_DESTROY_DELAY);

                }

            }

        }

        return Optional.empty();

    }

}

