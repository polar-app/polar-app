import {IWebkitFileSystem} from "./IWebkitFileSystem";

export namespace FileSystemFileEntries {

    import IWebkitFileSystemFileEntry = IWebkitFileSystem.IWebkitFileSystemFileEntry;
    import IWebkitFileSystemFileEntryAsync = IWebkitFileSystem.IWebkitFileSystemFileEntryAsync;

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
