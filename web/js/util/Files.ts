import fs, {PathLike, Stats} from "fs";

//import {promisify} from 'util';

// we tried to use import and @types with promisify but they were broken.
const {promisify} = require('util');

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
    public static async writeFileAsync(path: string, data: Buffer | string) {
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
                    resolve(true);
                })
                .catch((err) => {
                    if(err.code === 'ENOENT') {
                        resolve(false);
                    } else {
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

    public static async copyFileAsync(src: string, dest: string, flags: number = 0): Promise<string> {
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
