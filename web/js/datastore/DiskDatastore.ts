import {DocMeta} from '../metadata/DocMeta';
import {Datastore} from './Datastore';
import {Paths} from '../util/Paths';
import {Preconditions} from '../Preconditions';

const fs = require("fs");
const os = require("os");
const util = require('util');

const log = require("../logger/Logger").create();

export class DiskDatastore extends Datastore {

    public readonly dataDir: string;

    public readonly stashDir: string;

    public readonly logsDir: string;

    public readonly statAsync: StatAsync;

    public readonly readFileAsync: ReadFileAsync;

    public readonly writeFileAsync: WriteFileAsync;

    public readonly mkdirAsync: MkdirAsync;

    public readonly accessAsync: AccessAsync;

    public readonly unlinkAsync: UnlinkAsync;

    public readonly rmdirAsync: RmdirAsync;

    constructor(dataDir?: string) {

        // TODO: migrate this to use Directories

        super();

        if(dataDir) {
            // use a configured dataDir for testing.
            this.dataDir = dataDir;
        } else {
            this.dataDir = DiskDatastore.getDataDir();
        }

        // the path to the stash directory
        this.stashDir = Paths.create(this.dataDir, "stash");
        this.logsDir = Paths.create(this.dataDir, "logs");
        //this.cacheDir = Paths.create(this.dataDir, "cache");

        // TODO: migrate to Files

        this.readFileAsync = util.promisify(fs.readFile);
        this.writeFileAsync = util.promisify(fs.writeFile);
        this.mkdirAsync = util.promisify(fs.mkdir);
        this.accessAsync = util.promisify(fs.access);
        this.statAsync = util.promisify(fs.stat);
        this.unlinkAsync = util.promisify(fs.unlink);
        this.rmdirAsync = util.promisify(fs.rmdir);
        //this.existsAsync = fileExists;

    }

    async init() {

        return {
            dataDir: await this.createDirAsync(this.dataDir),
            stashDir: await this.createDirAsync(this.stashDir),
            logsDir: await this.createDirAsync(this.logsDir),
        };

    }

    /**
     * @Deprecated move to Files.
     */
    async createDirAsync(dir: string) {

        let result = {
            exists: false,
            created: false,
            dir
        };

        if(await this.existsAsync(dir)) {
            result.exists = true;
        } else {
            result.created = true;
            await this.mkdirAsync(dir);
        }

        return result;

    }

    /**
     * Get the DocMeta object we currently in the datastore for this given
     * fingerprint or null if it does not exist.
     */
    async getDocMeta(fingerprint: string): Promise<string | null> {

        let docDir = this.dataDir + "/" + fingerprint;

        if(! await this.existsAsync(docDir)) {
            return null;
        }

        let statePath = docDir + "/state.json";

        let statePathStat = await this.statAsync(statePath);

        if( ! statePathStat.isFile() ) {
            return null;
        }

        let canAccess =
            await this.accessAsync(statePath, fs.constants.R_OK | fs.constants.W_OK)
                      .then(() => true)
                      .catch(() => false);

        if(! canAccess) {
            return null;
        }

        let buffer = await this.readFileAsync(statePath);

        return buffer.toString('utf8');

    }

    /**
     * @Deprecated move to Files.
     */
    async existsAsync(path: string) {

        return new Promise((resolve, reject) => {

            this.statAsync(path)
                .then(() => {
                    resolve(true);
                })
                .catch(err => {
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
     * Write the datastore to disk.
     */
    async sync(fingerprint: string, data: string) {

        Preconditions.assertTypeOf(data, "string", "data");

        log.info("Performing sync of content into disk datastore.");

        let docDir = this.dataDir + "/" + fingerprint;

        let dirExists =
            await this.statAsync(docDir)
                      .then(() => true)
                      .catch(() => false)

        if ( ! dirExists) {
            // the directory for this file is missing.
            log.info(`Doc dir does not exist. Creating ${docDir}`);
            await this.mkdirAsync(docDir)
        }

        let statePath = docDir + "/state.json";

        log.info(`Writing data to state file: ${statePath}`);

        // FIXME: is this UTF-8 ??

        return await this.writeFileAsync(statePath, data);

    }

    static getUserHome() {

        let result = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];

        if(!result) {
            result = os.homedir();
        }

        return result;
    }

    static getDataDir() {
        return DiskDatastore.getUserHome() + "/.polar";
    }

}

export interface StatAsync {
    (path: string): Promise<any>;
}

export interface ReadFileAsync {
    (path: string): Promise<Buffer>;
}

export interface WriteFileAsync {
    (path: string, data: string): Promise<void>;
}

export interface MkdirAsync {
    (path: string): Promise<any>;
}

export interface AccessAsync {
    (path: string, mode?: number): Promise<Error>;
}

export interface UnlinkAsync {
    (path: string): Promise<Error>;
}

export interface RmdirAsync {
    (path: string): Promise<Error>;
}
