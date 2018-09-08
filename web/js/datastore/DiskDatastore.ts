import {Datastore} from './Datastore';
import {Preconditions} from '../Preconditions';
import {Logger} from '../logger/Logger';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {FileDeleted, Files} from '../util/Files';
import {FilePaths} from '../util/FilePaths';
import fs from 'fs';
import os from 'os';
import {Directories} from './Directories';

const log = Logger.create();

export class DiskDatastore implements Datastore {

    public readonly dataDir: string;

    public readonly stashDir: string;

    public readonly logsDir: string;

    public readonly dataDirConfig: DataDirConfig;

    private readonly directories: Directories;

    constructor(dataDir?: string) {

        // TODO: migrate this to use Directories

        this.directories = new Directories(dataDir);

        // the path to the stash directory
        this.dataDir = this.directories.dataDir;
        this.dataDirConfig = this.directories.dataDirConfig;
        this.stashDir = this.directories.stashDir;
        this.logsDir = this.directories.logsDir;

    }

    public async init() {
        return await this.directories.init();
    }

    /**
     * Return true if the DiskDatastore contains a document for the given
     * fingerprint
     */
    public async contains(fingerprint: string): Promise<boolean> {

        const docDir = FilePaths.join(this.dataDir, fingerprint);

        if ( ! await Files.existsAsync(docDir)) {
            return false;
        }

        const statePath = FilePaths.join(docDir, 'state.json');

        return await Files.existsAsync(statePath);

    }

    /**
     * Delete the DocMeta file and the underlying doc from the stash.
     *
     */
    public async delete(docMetaFileRef: DocMetaFileRef): Promise<Readonly<DeleteResult>> {

        const docDir = FilePaths.join(this.dataDir, docMetaFileRef.fingerprint);
        const statePath = FilePaths.join(docDir, 'state.json');

        return {
            docMetaFile: await Files.deleteAsync(statePath),
            dataFile: await Files.deleteAsync(docMetaFileRef.filename)
        };

    }

    /**
     * Get the DocMeta object we currently in the datastore for this given
     * fingerprint or null if it does not exist.
     */
    public async getDocMeta(fingerprint: string): Promise<string | null> {

        const docDir = FilePaths.join(this.dataDir, fingerprint);
        const statePath = FilePaths.join(docDir, 'state.json');

        if (! this.contains(fingerprint)) {
            log.error("Datastore does not contain document: ", fingerprint);
            return null;
        }

        const statePathStat = await Files.statAsync(statePath);

        if ( ! statePathStat.isFile() ) {
            log.error("Path is not a file: ", statePath);
            return null;
        }

        // noinspection TsLint:no-bitwise
        const canAccess =
            await Files.accessAsync(statePath, fs.constants.R_OK | fs.constants.W_OK)
                      .then(() => true)
                      .catch(() => false);

        if (! canAccess) {
            log.error("No access: ", statePath);
            return null;
        }

        const buffer = await Files.readFileAsync(statePath);

        return buffer.toString('utf8');

    }

    /**
     * Write the datastore to disk.
     */
    public async sync(fingerprint: string, data: string) {

        Preconditions.assertTypeOf(data, "string", "data");

        if (data.length === 0) {
            throw new Error("Invalid data");
        }

        if (data[0] !== '{') {
            throw new Error("Not JSON");
        }

        log.info("Performing sync of content into disk datastore");

        const docDir = FilePaths.join(this.dataDir, fingerprint);

        const docDirExists = await Files.existsAsync(docDir);

        log.debug(`Doc dir ${docDir} exists: ${docDirExists}`);

        if ( ! docDirExists) {
            log.debug(`Doc dir does not exist. Creating ${docDir}`);
            await Files.mkdirAsync(docDir);
        }

        log.debug("Calling stat on docDir: " + docDir);
        const stat = await Files.statAsync(docDir);

        if (! stat.isDirectory()) {
            throw new Error("Path is not a directory: " + docDir);
        }

        const statePath = FilePaths.join(docDir, "state.json");

        log.info(`Writing data to state file: ${statePath}`);

        return await Files.writeFileAsync(statePath, data, {encoding: 'utf8'});

    }

    public async getDocMetaFiles(): Promise<DocMetaRef[]> {

        if ( ! await Files.existsAsync(this.dataDir)) {
            // no data dir but this should rarely happen.
            return [];
        }

        const fileNames = await Files.readdirAsync(this.dataDir);

        const result: DocMetaRef[] = [];

        for ( const fileName of fileNames) {

            const docMetaDir = FilePaths.join(this.dataDir, fileName);
            const docMetaDirStat = await Files.statAsync(docMetaDir);

            if (docMetaDirStat.isDirectory()) {

                const stateFile = FilePaths.join(this.dataDir, fileName, 'state.json');

                const exists = await Files.existsAsync(stateFile);
                if (exists) {
                    result.push({fingerprint: fileName});
                }

            }

        }

        return result;
    }

    public static getUserHome() {

        let result = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];

        if (!result) {
            result = os.homedir();
        }

        return result;
    }

}

export interface DataDir {

    /**
     * The path to the data dir.
     */
    path: string | undefined | null;

    /**
     * How the data dir was configured.
     */
    strategy: 'env' | 'home';

}

export interface DataDirConfig {

    path: string;

    /**
     * How the data dir was configured.
     */
    strategy: 'env' | 'home' | 'manual';

}

export interface DeleteResult {

    docMetaFile: Readonly<FileDeleted>;

    dataFile: Readonly<FileDeleted>;

}
