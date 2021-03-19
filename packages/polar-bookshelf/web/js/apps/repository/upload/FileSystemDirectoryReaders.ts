import {IWebkitFileSystem} from "./IWebkitFileSystem";

export namespace FileSystemDirectoryReaders {

    import IWebkitFileSystemDirectoryReader = IWebkitFileSystem.IWebkitFileSystemDirectoryReader;
    import IWebkitFileSystemDirectoryReaderAsync = IWebkitFileSystem.IWebkitFileSystemDirectoryReaderAsync;
    import IWebkitFileSystemEntry = IWebkitFileSystem.IWebkitFileSystemEntry;

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
