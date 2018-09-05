import fs, {PathLike, Stats} from "fs";
import {promisify} from 'util';
import ErrnoException = NodeJS.ErrnoException;
import {Logger} from '../logger/Logger';

const log = Logger.create();

export class Files {

    /**
     *
     * https://nodejs.org/api/fs.html#fs_fs_readfile_path_options_callback
     *
     */
    public static async readFileAsync(path: string): Promise<Buffer> {
        throw new Error("Not replaced via promisify");
    }

    // https://nodejs.org/api/fs.html#fs_fs_writefile_file_data_options_callback


    /**
     * Asynchronously writes data to a file, replacing the file if it already exists.
     * @param path A path to a file. If a URL is provided, it must use the `file:` protocol.
     * URL support is _experimental_.
     * If a file descriptor is provided, the underlying file will _not_ be closed automatically.
     * @param data The data to write. If something other than a Buffer or Uint8Array is provided, the value is coerced to a string.
     * @param options Either the encoding for the file, or an object optionally specifying the encoding, file mode, and flag.
     * If `encoding` is not supplied, the default of `'utf8'` is used.
     * If `mode` is not supplied, the default of `0o666` is used.
     * If `mode` is a string, it is parsed as an octal integer.
     * If `flag` is not supplied, the default of `'w'` is used.
     */
    public static async writeFileAsync(path: string, data: Buffer | string, options?: { encoding?: string | null; mode?: number | string; flag?: string; } | string | undefined | null) {
        throw new Error("Not replaced via promisify");
    }

    public static async createDirAsync(dir: string, mode?: number | string | undefined | null) {

        let result: CreateDirResult = {
            dir
        };

        if(await this.existsAsync(dir)) {
            result.exists = true;
        } else {
            result.created = true;
            await this.mkdirAsync(dir, mode);
        }

        return result;

    }

    public static async existsAsync(path: string): Promise<boolean> {

        return new Promise<boolean>((resolve, reject) =>  {

            this.statAsync(path)
                .then(() => {
                    //log.debug("Path exists: " + path);
                    resolve(true);
                })
                .catch((err: ErrnoException) => {
                    if(err.code === 'ENOENT') {
                        //log.debug("Path does not exist due to ENOENT: " + path, err);
                        resolve(false);
                    } else {
                        //log.debug("Received err within existsAsync: "+ path, err);
                        // some other error
                        reject(err);
                    }
                });

        });

    }

    /**
     *  Remove a file, whether it is present or not.  Make sure it's not there.
     */
    public static async removeAsync(path: string) {

        if(await this.existsAsync(path)) {
            await this.unlinkAsync(path);
        }

    }

    public static async statAsync(path: string): Promise<Stats> {
        throw new Error("Not replaced via promisify");
    }

    public static async mkdirAsync(path: string, mode?: number | string | undefined | null): Promise<void> {
        throw new Error("Not replaced via promisify");
    }

    public static async accessAsync(path: PathLike, mode: number | undefined): Promise<void> {
        throw new Error("Not replaced via promisify");
    }

    public static async unlinkAsync(path: PathLike): Promise<void> {
        throw new Error("Not replaced via promisify");
    }

    public static async rmdirAsync(path: PathLike): Promise<void> {
        throw new Error("Not replaced via promisify");
    }

    public static async readdirAsync(path: string): Promise<string[]> {
        throw new Error("Not replaced via promisify");
    }

    public static async realpathAsync(path: string): Promise<string> {
        throw new Error("Not replaced via promisify");
    }

    public static async copyFileAsync(src: string, dest: string, flags?: number): Promise<void> {
        throw new Error("Not replaced via promisify");
    }

}

Files.readFileAsync = promisify(fs.readFile);
Files.writeFileAsync = promisify(fs.writeFile);
Files.mkdirAsync = promisify(fs.mkdir);
Files.accessAsync = promisify(fs.access);
Files.statAsync = promisify(fs.stat);
Files.unlinkAsync = promisify(fs.unlink);
Files.rmdirAsync = promisify(fs.rmdir);
Files.readdirAsync = promisify(fs.readdir);
Files.realpathAsync = promisify(fs.realpath);
Files.copyFileAsync = promisify(fs.copyFile);

export interface CreateDirResult {
    dir: string;
    exists?: boolean;
    created?: boolean;
}
