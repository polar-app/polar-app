import fs, {PathLike, Stats} from "fs";
import {promisify} from 'util';
import {Logger} from '../logger/Logger';
import ErrnoException = NodeJS.ErrnoException;
import {isPresent, Preconditions} from "../Preconditions";
import {FilePaths} from "./FilePaths";

const log = Logger.create();

export class Files {

    /**
     * Create a recursive directory snapshot of files using hard links.
     *
     * @param filter Accept any files that pass the filter predicate (return true).
     *
     */
    public static async createDirectorySnapshot(path: string,
                                                targetPath: string,
                                                filter: DirectorySnapshotPredicate = ACCEPT_ALL): Promise<SnapshotFiles> {

        const files: string[] = [];
        const dirs: SnapshotFiles[] = [];

        const result = Object.freeze({path, files, dirs});

        if (! await this.existsAsync(path)) {
            throw new Error("Path does not exist: " + path);
        }

        if (! filter(path, targetPath)) {
            return result;
        }

        if (! await this.existsAsync(targetPath)) {
            await Files.createDirAsync(targetPath);
        }

        // make sure we're given a directory and not a symlink, character
        // device, etc.
        Preconditions.assertEqual('directory',
                                  await Files.fileType(path),
                                  'Path had invalid type: ' + path);

        const dirEntries = await this.readdirAsync(path);

        for (const dirEntry of dirEntries) {

            const dirEntryPath = FilePaths.join(path, dirEntry);
            const dirEntryType = await this.fileType(dirEntryPath);

            const targetFilePath = FilePaths.join(targetPath, dirEntry);

            if (dirEntryType === 'directory') {

                const dirResult = await this.createDirectorySnapshot(dirEntryPath, targetFilePath, filter);
                dirs.push(dirResult);

            } else if (dirEntryType === 'file') {
                // handle a normal file removal.
                await this.linkAsync(dirEntryPath, targetFilePath);
                files.push(dirEntry);

            } else {
                throw new Error(`Unable to handle dir entry: ${dirEntryPath} of type ${dirEntryType}`);
            }

        }

        return result;

    }


    public static async removeDirectoryRecursivelyAsync(path: string): Promise<RemovedFiles> {

        const files: string[] = [];
        const dirs: RemovedFiles[] = [];

        if (! await this.existsAsync(path)) {
            // this isn't a failure as the file is already absent
            return Object.freeze({path, files, dirs});
        }

        // make sure we're given a directory and not a symlink, character
        // device, etc.  We have to check immediately because we don't want to
        // start removing files only to find out that it's part of a symlink'd
        // directory.
        Preconditions.assertEqual('directory',
                                  await Files.fileType(path),
                                  'Path had invalid type: ' + path);

        const dirEntries = await this.readdirAsync(path);

        for (const dirEntry of dirEntries) {

            const dirEntryPath = FilePaths.join(path, dirEntry);
            const dirEntryType = await this.fileType(dirEntryPath);

            if (dirEntryType === 'directory') {
                const dirResult = await this.removeDirectoryRecursivelyAsync(dirEntryPath);
                dirs.push(dirResult);
            } else if (dirEntryType === 'file') {
                // handle a normal file removal.
                await this.removeAsync(dirEntryPath);
                files.push(dirEntry);
            } else {
                throw new Error(`Unable to handle dir entry: ${dirEntryPath} of type ${dirEntryType}`);
            }

        }

        // now remove the directory we've been given.
        await this.rmdirAsync(path);

        return Object.freeze({path, files, dirs});

    }

    public static async fileType(path: string): Promise<FileType> {

        const stat = await this.statAsync(path);

        if (stat.isBlockDevice()) {
            return 'block-device';
        } else if (stat.isCharacterDevice()) {
            return 'character-device';
        } else if (stat.isFIFO()) {
            return 'fifo';
        } else if (stat.isSocket()) {
            return 'socket';
        } else if (stat.isSymbolicLink()) {
            return 'symbolic-link';
        } else if (stat.isFile()) {
            return 'file';
        } else if (stat.isDirectory()) {
            return 'directory';
        }

        throw new Error("Unable to determine file type for: " + path);

    }

    /**
     *  Remove a file, whether it is present or not.  Make sure it's not there.
     */
    public static async removeAsync(path: string) {

        if (await this.existsAsync(path)) {
            await this.unlinkAsync(path);
        }

    }

    /**
     * Like unlinkAsync but only calls unlinkAsync if the file exists and we
     * return a result object about the action performed.
     *
     * @param path The path to delete.
     */
    public static async deleteAsync(path: string): Promise<Readonly<FileDeleted>> {

        if ( await this.existsAsync(path)) {
            await this.unlinkAsync(path);
            return { path, deleted: true};
        }

        return { path, deleted: false};

    }

    public static async existsAsync(path: string): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) =>  {

            this.statAsync(path)
                .then(() => {
                    // log.debug("Path exists: " + path);
                    resolve(true);
                })
                .catch((err: ErrnoException) => {
                    if (err.code === 'ENOENT') {
                        // log.debug("Path does not exist due to ENOENT: " +
                        // path, err);
                        resolve(false);
                    } else {
                        // log.debug("Received err within existsAsync: "+ path,
                        // err); some other error
                        reject(err);
                    }
                });

        });

    }

    public static createDirSync(dir: string,  mode?: number | string | undefined | null) {

        const result: CreateDirResult = {
            dir
        };

        if (fs.existsSync(dir)) {
            result.exists = true;
        } else {
            result.created = true;
            fs.mkdirSync(dir, mode);
        }

        return result;

    }

    /**
     *
     * Create a dir 'safely' by skipping the mkdirAsync if it already exists.
     *
     * @param dir
     * @param mode
     */
    public static async createDirAsync(dir: string, mode?: number | string | undefined | null) {

        const result: CreateDirResult = {
            dir
        };

        if (await this.existsAsync(dir)) {
            result.exists = true;
        } else {
            result.created = true;

            try {
                await this.mkdirAsync(dir, mode);
            } catch (e) {

                if (e.code && e.code === 'EEXIST') {
                    // this is acceptable as the file already exists and there
                    // may have been a race creating it.
                    result.exists = true;
                } else {
                    throw e;
                }

            }

        }

        return result;

    }

    /**
     *
     * https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback
     *
     */
    public static async readFileAsync(path: PathLike | number): Promise<Buffer> {
        return this.withProperException(() => this.Promised.readFileAsync(path));
    }

    public static createReadStream(path: PathLike, options?: CreateReadStreamOptions): fs.ReadStream {
        return fs.createReadStream(path, options);
    }

    // https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback

    /**
     * Asynchronously writes data to a file, replacing the file if it already
     * exists.
     *
     * @param path A path to a file. If a URL is provided, it must use the
     * `file:` protocol. URL support is _experimental_. If a file descriptor is
     * provided, the underlying file will _not_ be closed automatically.
     *
     * @param data The data to write. If something other than a Buffer or
     * Uint8Array is provided, the value is coerced to a string.
     *
     * @param options Either the encoding for the file, or an object optionally
     * specifying the encoding, file mode, and flag.
     * If `encoding` is not supplied, the default of `'utf8'` is used.
     * If `mode` is not supplied, the default of `0o666` is used.
     * If `mode` is a string, it is parsed as an octal integer.
     * If `flag` is not supplied, the default of `'w'` is used.
     */
    public static async writeFileAsync(path: string,
                                       data: FileHandle | NodeJS.ReadableStream | Buffer | string,
                                       options?: WriteFileAsyncOptions | string | undefined | null) {


        if (data instanceof Buffer || typeof data === 'string') {

            return this.withProperException(() => this.Promised.writeFileAsync(path, data, options));

        } else if ( FileHandles.isFileHandle(data) ) {

            const fileRef = <FileHandle> data;
            Files.createReadStream(fileRef.path).pipe(fs.createWriteStream(path));

        } else {

            const readableStream = <NodeJS.ReadableStream> data;
            readableStream.pipe(fs.createWriteStream(path));
        }

    }

    public static async statAsync(path: string): Promise<Stats> {
        return this.withProperException(() => this.Promised.statAsync(path));
    }

    public static async mkdirAsync(path: string, mode?: number | string | undefined | null): Promise<void> {
        return this.withProperException(() => this.Promised.mkdirAsync(path, mode));
    }

    public static async accessAsync(path: PathLike, mode: number | undefined): Promise<void> {
        return this.withProperException(() => this.Promised.accessAsync(path, mode));
    }

    public static async unlinkAsync(path: PathLike): Promise<void> {
        return this.withProperException(() => this.Promised.unlinkAsync(path));
    }

    public static async rmdirAsync(path: PathLike): Promise<void> {
        return this.withProperException(() => this.Promised.rmdirAsync(path));
    }

    public static async linkAsync(existingPath: PathLike, newPath: PathLike): Promise<void> {
        return this.withProperException(() => this.Promised.linkAsync(existingPath, newPath));
    }

    public static async readdirAsync(path: string): Promise<string[]> {
        return this.withProperException(() => this.Promised.readdirAsync(path));
    }

    public static async realpathAsync(path: string): Promise<string> {
        return this.withProperException(() => this.Promised.realpathAsync(path));
    }

    public static async copyFileAsync(src: string, dest: string, flags?: number): Promise<void> {
        return this.withProperException(() => this.Promised.copyFileAsync(src, dest, flags));
    }

    public static async appendFileAsync(path: string | Buffer | number,
                                        data: string | Buffer,
                                        options?: AppendFileOptions): Promise<void> {

        return this.withProperException(() => this.Promised.appendFileAsync(path, data, options));

    }

    /**
     *
     * @param flags https://nodejs.org/api/fs.html#fs_file_system_flags
     */
    public static async openAsync(path: string | Buffer,
                                  flags: string | number,
                                  mode?: number): Promise<number> {

        return this.withProperException(() => this.Promised.openAsync(path, flags, mode));

    }

    /**
     *
     */
    public static async closeAsync(fd: number): Promise<void> {
        return this.withProperException(() => this.Promised.closeAsync(fd));
    }

    public static async fdatasyncAsync(fd: number): Promise<void> {
        return this.withProperException(() => this.Promised.fdatasyncAsync(fd));
    }

    public static async fsyncAsync(fd: number): Promise<void> {
        return this.withProperException(() => this.Promised.fsyncAsync(fd));
    }

    private static async withProperException<T>(func: () => Promise<T>): Promise<T> {

        // the only way to get this to work with node is to create an 'anchor'
        // exception on the entry before we call the method. The downside of
        // this is that each FS call creates an exception which is excess CPU
        // but is still a fraction of the actual IO workload.
        const anchor = new Error("anchor");

        try {
            return await func();
        } catch (err) {
            throw this.createProperException(anchor, err);
        }

    }

    private static createProperException(err: Error, source: ErrnoException ) {

        // strip the first line of the stack err, and add the message from
        // source.

        if (err.stack) {
            const stackArr = err.stack.split('\n');
            stackArr.shift();
            stackArr.unshift(source.message);
            source.stack = stackArr.join('\n');
        }

        return source;
    }

    // noinspection TsLint
    private static readonly Promised = {

        readFileAsync: promisify(fs.readFile),
        writeFileAsync: promisify(fs.writeFile),
        mkdirAsync: promisify(fs.mkdir),
        accessAsync: promisify(fs.access),
        statAsync: promisify(fs.stat),
        unlinkAsync: promisify(fs.unlink),
        rmdirAsync: promisify(fs.rmdir),
        readdirAsync: promisify(fs.readdir),
        realpathAsync: promisify(fs.realpath),
        copyFileAsync: promisify(fs.copyFile),
        appendFileAsync: promisify(fs.appendFile),
        openAsync: promisify(fs.open),
        closeAsync: promisify(fs.close),
        fdatasyncAsync: promisify(fs.fdatasync),
        fsyncAsync: promisify(fs.fsync),
        linkAsync: promisify(fs.link),

    };

}

export interface CreateDirResult {
    dir: string;
    exists?: boolean;
    created?: boolean;
}

export interface WriteFileAsyncOptions {
    encoding?: string | null;
    mode?: number | string;
    flag?: string;
}

export interface AppendFileOptions {
    encoding?: string | null;
    mode: number;
    flag: string;
}

export interface FileDeleted {

    path: string;

    deleted: boolean;

}

export type CreateReadStreamOptions = string | {
    flags?: string;
    encoding?: string;
    fd?: number;
    mode?: number;
    autoClose?: boolean;
    start?: number;
    end?: number;
    highWaterMark?: number;
};

/**
 * Reference to a local file.
 */
export interface FileHandle {
    path: string;
}

export class FileHandles {

    public static isFileHandle(obj: any): boolean {
        return typeof obj === 'object' && isPresent(obj.path);
    }

}

export interface RemovedFiles {
    readonly path: string;
    readonly files: ReadonlyArray<string>;
    readonly dirs: ReadonlyArray<RemovedFiles>;
}

export interface SnapshotFiles {
    readonly path: string;
    readonly files: ReadonlyArray<string>;
    readonly dirs: ReadonlyArray<SnapshotFiles>;
}


export type FileType = 'file' | 'directory' | 'block-device' |
                       'character-device' | 'fifo' | 'socket' |
                       'symbolic-link';

export type DirectorySnapshotPredicate = (path: string, targetPath: string) => boolean;

export const ACCEPT_ALL: DirectorySnapshotPredicate = () => true;

