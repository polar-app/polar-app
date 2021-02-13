import {Callback1} from "polar-shared/src/util/Functions";

export namespace IWebkitFileSystem {
    export interface IWebkitFileSystemEntryBase {

        readonly fullPath: string;
        readonly name: string;
        readonly toURL: () => string;

    }

    export interface IWebkitFileSystemFileEntry extends IWebkitFileSystemEntryBase {
        readonly isFile: true;
        readonly isDirectory: false;
        readonly file: (callback: Callback1<File>, onError: OnErrorCallback) => void;
    }

    export interface IWebkitFileSystemFileEntryAsync extends IWebkitFileSystemEntryBase {
        readonly isFile: true;
        readonly isDirectory: false;
        readonly file: () => Promise<File>;
    }


    export interface IWebkitFileSystemDirectoryEntry extends IWebkitFileSystemEntryBase {
        readonly isFile: false;
        readonly isDirectory: true;
        readonly createReader: () => IWebkitFileSystemDirectoryReader;
    }

    export type IWebkitFileSystemEntry = IWebkitFileSystemFileEntry | IWebkitFileSystemDirectoryEntry;

    export interface IWebkitFileSystemFileMetadata {
        readonly size: number;
        readonly modificationTime: Date;
    }

    export type OnErrorCallback = (err: Error) => void;

    export interface IWebkitFileSystemReadEntry {

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

    export interface IWebkitFileSystemDirectoryReader {
        readonly readEntries: (callback: Callback1<ReadonlyArray<IWebkitFileSystemEntry>>, onError: OnErrorCallback) => void;
    }

    export interface IWebkitFileSystemDirectoryReaderAsync {
        readonly readEntries: () => Promise<ReadonlyArray<IWebkitFileSystemEntry>>;
    }

}
