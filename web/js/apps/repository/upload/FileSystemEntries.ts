import {IWebkitFileSystem} from "./IWebkitFileSystem";

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

}
