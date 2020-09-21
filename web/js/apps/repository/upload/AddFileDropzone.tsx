import * as React from "react";
import {
    useAddFileDropzoneCallbacks,
    useAddFileDropzoneStore
} from "./AddFileDropzoneStore";
import {
    useComponentDidMount,
    useComponentWillUnmount
} from "../../../hooks/ReactLifecycleHooks";
import {Callback1} from "polar-shared/src/util/Functions";
import {AddFileDropzoneDialog2} from "./AddFileDropzoneDialog2";
import {useLogger} from "../../../mui/MUILogger";
import {asyncStream} from "polar-shared/src/util/AsyncArrayStreams";
import {AddFileHooks, IUpload} from "./AddFileHooks";
import useAddFileImporter = AddFileHooks.useAddFileImporter;
import {Arrays} from "polar-shared/src/util/Arrays";

interface IWebkitFileSystemEntryBase {

    readonly fullPath: string;
    readonly name: string;
    readonly toURL: () => string;

}


interface IWebkitFileSystemFileEntry extends IWebkitFileSystemEntryBase {
    readonly isFile: true;
    readonly isDirectory: false;
    readonly file: (callback: Callback1<File>, onError: OnErrorCallback) => void;
}

interface IWebkitFileSystemFileEntryAsync extends IWebkitFileSystemEntryBase {
    readonly isFile: true;
    readonly isDirectory: false;
    readonly file: () => Promise<File>;
}


interface IWebkitFileSystemDirectoryEntry extends IWebkitFileSystemEntryBase {
    readonly isFile: false;
    readonly isDirectory: true;
    readonly createReader: () => IWebkitFileSystemDirectoryReader;
}

type IWebkitFileSystemEntry = IWebkitFileSystemFileEntry | IWebkitFileSystemDirectoryEntry;

interface IWebkitFileSystemFileMetadata {
    readonly size: number;
    readonly modificationTime: Date;
}

type OnErrorCallback = (err: Error) => void;

interface IWebkitFileSystemReadEntry {

    readonly fullPath: string;
    readonly isDirectory: boolean;
    readonly isFile: boolean;
    readonly name: string;

    readonly getMetadata: (callback: Callback1<IWebkitFileSystemFileMetadata>,
                           onError: OnErrorCallback) => void;

    readonly getParent: (callback: Callback1<IWebkitFileSystemEntry>,
                         onError: OnErrorCallback) => void;

    // Creates and returns a URL which identifies the entry. This URL uses the
    // URL scheme "filesystem:".
    readonly toURL: () => string;

}

interface IWebkitFileSystemDirectoryReader {
    readonly readEntries: (callback: Callback1<ReadonlyArray<IWebkitFileSystemEntry>>, onError: OnErrorCallback) => void;
}

interface IWebkitFileSystemDirectoryReaderAsync {
    readonly readEntries: () => Promise<ReadonlyArray<IWebkitFileSystemEntry>>;
}

namespace FileSystemDirectoryReaders {

    export function toAsync(reader: IWebkitFileSystemDirectoryReader): IWebkitFileSystemDirectoryReaderAsync {
        return {
            readEntries: () => {
                return new Promise<ReadonlyArray<IWebkitFileSystemEntry>>((resolve, reject) => {
                    reader.readEntries(result => resolve(result), err => reject(err));
                });
            }
        }
    }

}

namespace FileSystemFileEntries {

    export function toAsync(entry: IWebkitFileSystemFileEntry): IWebkitFileSystemFileEntryAsync {
        return {
            isFile: entry.isFile,
            isDirectory: entry.isDirectory,
            fullPath: entry.fullPath,
            name: entry.name,
            toURL: entry.toURL,
            file: () => {
                return new Promise<File>((resolve, reject) => {
                    entry.file(result => resolve(result), err => reject(err));
                });
            }
        }
    }

}

function toAsyncCallback<T>(delegate: (callback: Callback1<T>, onError: OnErrorCallback) => void) {
    return new Promise<T>((resolve, reject) => {
        delegate(result => resolve(result), err => reject(err));
    });
}

namespace FileSystemEntries {

    export function isFile(entry: IWebkitFileSystemEntry): entry is IWebkitFileSystemFileEntry {
        return entry.isFile;
    }

    export function isDirectory(entry: IWebkitFileSystemEntry): entry is IWebkitFileSystemDirectoryEntry {
        return entry.isDirectory;
    }

}

async function recurseDataTransferItems(items: ReadonlyArray<DataTransferItem>): Promise<ReadonlyArray<IWebkitFileSystemFileEntry>> {
    return recurseFileSystemEntries(items.map(item => item.webkitGetAsEntry()));
}

async function recurseFileSystemEntries(entries: ReadonlyArray<IWebkitFileSystemEntry>): Promise<ReadonlyArray<IWebkitFileSystemFileEntry>> {

    const result: IWebkitFileSystemFileEntry[] = [];

    for (const entry of entries) {

        // FIXME: I think we STILL need the add file dialog so that users can
        // use a system dialog???

        if (entry.isFile) {
            result.push(entry);
        } else if (FileSystemEntries.isDirectory(entry)) {

            const reader = entry.createReader();
            const asyncReader = FileSystemDirectoryReaders.toAsync(reader);

            // https://stackoverflow.com/questions/3590058/does-html5-allow-drag-drop-upload-of-folders-or-a-folder-tree
            // FIXME: To actually get all the files, we'll need to call
            // readEntries repeatedly (for each directory we encounter) until it
            // returns an empty array. If we don't, we will miss some
            // files/sub-directories in a directory e.g. in Chrome, readEntries
            // will only return at most 100 entries at a time.

            const dirEntries = await asyncReader.readEntries();
            const recursedEntries = await recurseFileSystemEntries(dirEntries);
            result.push(...recursedEntries);
        }

    }

    return result;

}

async function filesToUploads(entries: ReadonlyArray<IWebkitFileSystemFileEntry>) {

    // FIXME: progress callbacks aren't working
    // FIXME: I think we should bring back the last dropbox so you can click on
    // it to get a upload dialog...

    async function toUpload(entry: IWebkitFileSystemFileEntry): Promise<IUpload> {

        const asyncEntry = FileSystemFileEntries.toAsync(entry);

        const file = await asyncEntry.file();
        return {
            blob: file,
            name: entry.name
        }
    }

    return await asyncStream(entries)
        .filter(current => {
            const name = current.name.toLowerCase();
            return name.endsWith(".pdf") || name.endsWith(".epub");
        })
        .map(toUpload)
        .collect();

}

function useDropHandler() {

    const log = useLogger();
    const addFileImporter = useAddFileImporter();

    return React.useCallback((event: DragEvent) => {

        event.preventDefault();

        console.log("FIXME: dataTransfer: ", event.dataTransfer);

        if (event.dataTransfer && event.dataTransfer.files) {
            console.log("FIXME: files: ", event.dataTransfer.files);
        }

        // FIXME the items have type strings too and we should handle those
        // here via a filter as well...
        if (event.dataTransfer && event.dataTransfer.items) {

            const items = Array.from(event.dataTransfer.items);
            console.log("FIXME0: items: ", items);
            const entries = items.map(current => current.webkitGetAsEntry());
            console.log("FIXME0: entries: ", entries);

            const first = Arrays.first(Array.from(event.dataTransfer.items));
            if (first) {
                // FIXME: toURL is not working here.
                const entry = first.webkitGetAsEntry();
                console.log("FIXME: entry: ", entry);
                console.log("FIXME: entry URL: ", entry.toURL());
            }
        }

        async function doAsync() {

            // https://developers.google.com/web/updates/2012/07/Drag-and-drop-a-folder-onto-Chrome-now-available
            // https://www.html5rocks.com/en/tutorials/file/filesystem/
            // https://wiki.whatwg.org/wiki/DragAndDropEntries

            if (! event.dataTransfer) {
                return;
            }
            if (! event.dataTransfer.types) {
                return;
            }

            if (! event.dataTransfer.types.includes('Files')) {
                return;
            }

            if (event.dataTransfer.items) {

                // FIXME: need to filter PDF and EPUB files...

                const items = Array.from(event.dataTransfer.items);
                const files = await recurseDataTransferItems(items);
                const uploads = await filesToUploads(files);
                addFileImporter(uploads);

            } else if (event.dataTransfer.files) {

                // fail over to working with individual files which applies to
                // Firefox and older browsers

                function toUpload(file: File): IUpload {
                    return {
                        blob: file,
                        name: file.name
                    };
                }

                const files = Array.from(event.dataTransfer.files);
                const uploads = files.map(toUpload);
                addFileImporter(uploads);

            }

        }

        doAsync()
            .catch(err => log.error(err));

    }, [addFileImporter]);

}

function isFileTransfer(event: DragEvent) {

    if (! event.dataTransfer) {
        return false;
    }

    console.log("Handling file transfer: ", event.dataTransfer.types);

    // https://stackoverflow.com/questions/6848043/how-do-i-detect-a-file-is-being-dragged-rather-than-a-draggable-element-on-my-pa

    if (event.dataTransfer.types) {

        // we need to detect if this is using the files types because
        // we do not have the actual files until the drop is complete.

        if (event.dataTransfer.types.includes('Files') ||
            event.dataTransfer.types.includes('application/x-moz-file')) {

            return true;
        }

    }

    if (! event.dataTransfer.files) {
        return false;
    }

    if (event.dataTransfer.files.length === 0) {
        return false;
    }

    return true;

}

/**
 * Listens for drag and drop and performs the actual import when files are
 * dropped
 *
 */
export function useDragAndDropImportListener() {

    const dropHandler = useDropHandler();

    const handleDragOver = React.useCallback((event: DragEvent) => {
        event.preventDefault();
    }, []);


    const handleDrop = React.useCallback((event: DragEvent) => {
        dropHandler(event);
    }, []);

    useComponentDidMount(() => {
        window.addEventListener('dragover', handleDragOver);
        window.addEventListener('drop', handleDrop);
    });

    useComponentWillUnmount(() => {
        window.removeEventListener('dragover', handleDragOver);
        window.removeEventListener('drop', handleDrop);
    });

}

/**
 * Listens for files being imported and shows a backdrop telling the user what
 * to do.
 */
export function useDragAndDropBackdropListener() {

    const {setActive} = useAddFileDropzoneCallbacks();

    const depth = React.useRef(0);
    const onDragEnter = React.useCallback((event: DragEvent) => {

        if (! isFileTransfer(event)) {
            return;
        }

        // files are being dropped so we should focus this window otherwise it
        // gets confusing
        window.focus();

        if (depth.current === 0) {
            setActive(true);
        }

        ++depth.current;

    }, []);

    const onDragLeaveOrDrop = React.useCallback((event: DragEvent) => {

        if (! isFileTransfer(event)) {
            return;
        }

        --depth.current;

        if (depth.current === 0) {
            setActive(false);
        }

    }, []);

    useComponentDidMount(() => {
        window.addEventListener('dragenter', onDragEnter);
        window.addEventListener('dragleave', onDragLeaveOrDrop);
        window.addEventListener('drop', onDragLeaveOrDrop);
    });

    useComponentWillUnmount(() => {
        window.removeEventListener('dragenter', onDragEnter);
        window.removeEventListener('dragleave', onDragLeaveOrDrop);
        window.removeEventListener('drop', onDragLeaveOrDrop);
    });

}

// useDropHandler

export const AddFileDropzone = React.forwardRef((props: any, ref) => {

    const {active} = useAddFileDropzoneStore(['active']);
    const callbacks = useAddFileDropzoneCallbacks();

    function closeDialog() {
        callbacks.setActive(false);
    }

    return (
        <AddFileDropzoneDialog2 open={active} onClose={closeDialog}/>
        // <AddFileDropzoneDialog open={active}
        //                        noActions={true}
        //                        onClose={closeDialog}/>
    );

});
