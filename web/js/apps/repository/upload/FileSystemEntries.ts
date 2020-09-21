import {IWebkitFileSystem} from "./IWebkitFileSystem";
import {FileSystemDirectoryReaders} from "./FileSystemDirectoryReaders";

export namespace FileSystemEntries {

    import IWebkitFileSystemEntry = IWebkitFileSystem.IWebkitFileSystemEntry;
    import IWebkitFileSystemFileEntry = IWebkitFileSystem.IWebkitFileSystemFileEntry;
    import IWebkitFileSystemDirectoryEntry = IWebkitFileSystem.IWebkitFileSystemDirectoryEntry;

    export function isFile(entry: IWebkitFileSystemEntry): entry is IWebkitFileSystemFileEntry {
        return entry.isFile;
    }

    export function isDirectory(entry: IWebkitFileSystemEntry): entry is IWebkitFileSystemDirectoryEntry {
        return entry.isDirectory;
    }

    export async function recurseDataTransferItems(items: ReadonlyArray<DataTransferItem>): Promise<ReadonlyArray<IWebkitFileSystemFileEntry>> {
        return recurseFileSystemEntries(items.map(item => item.webkitGetAsEntry()));
    }

    export async function recurseFileSystemEntries(entries: ReadonlyArray<IWebkitFileSystemEntry>): Promise<ReadonlyArray<IWebkitFileSystemFileEntry>> {

        const result: IWebkitFileSystemFileEntry[] = [];

        for (const entry of entries) {

            if (entry.isFile) {
                result.push(entry);
            } else if (FileSystemEntries.isDirectory(entry)) {

                const reader = entry.createReader();
                const asyncReader = FileSystemDirectoryReaders.toAsync(reader);

                while (true) {

                    const dirEntries = await asyncReader.readEntries();

                    if (dirEntries.length === 0) {

                        // https://stackoverflow.com/questions/3590058/does-html5-allow-drag-drop-upload-of-folders-or-a-folder-tree

                        // To actually get all the files, we'll need to call
                        // readEntries repeatedly (for each directory we encounter)
                        // until it returns an empty array. If we don't, we will
                        // miss some files/sub-directories in a directory e.g. in
                        // Chrome, readEntries will only return at most 100 entries
                        // at a time.
                        break;

                    }

                    const recursedEntries = await recurseFileSystemEntries(dirEntries);
                    result.push(...recursedEntries);

                }

            }

        }

        return result;

    }

}
