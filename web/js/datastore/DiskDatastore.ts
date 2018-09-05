import {Datastore} from './Datastore';
import {Preconditions} from '../Preconditions';
import {Logger} from '../logger/Logger';
import {DocMetaRef} from './DocMetaRef';
import {Files} from '../util/Files';
import {FilePaths} from '../util/FilePaths';
import fs from 'fs';
import os from 'os';

const log = Logger.create();

export class DiskDatastore implements Datastore {

    public readonly dataDir: string;

    public readonly stashDir: string;

    public readonly logsDir: string;

    constructor(dataDir?: string) {

        // TODO: migrate this to use Directories

        if(dataDir) {
            // use a configured dataDir for testing.
            this.dataDir = dataDir;
        } else {
            this.dataDir = DiskDatastore.getDataDir();
        }

        // the path to the stash directory
        this.stashDir = FilePaths.create(this.dataDir, "stash");
        this.logsDir = FilePaths.create(this.dataDir, "logs");

    }

    async init() {

        return {
            dataDir: await Files.createDirAsync(this.dataDir),
            stashDir: await Files.createDirAsync(this.stashDir),
            logsDir: await Files.createDirAsync(this.logsDir),
        };

    }

    /**
     * Return true if the DiskDatastore contains a document for the given fingerprint
     */
    async contains(fingerprint: string): Promise<boolean> {

        let docDir = FilePaths.join(this.dataDir, fingerprint);

        if( ! await Files.existsAsync(docDir)) {
            return false;
        }

        let statePath = FilePaths.join(docDir, 'state.json');

        return await Files.existsAsync(statePath);

    }

    /**
     * Get the DocMeta object we currently in the datastore for this given
     * fingerprint or null if it does not exist.
     */
    async getDocMeta(fingerprint: string): Promise<string | null> {

        let docDir = FilePaths.join(this.dataDir, fingerprint);
        let statePath = FilePaths.join(docDir, 'state.json');

        if(! this.contains(fingerprint)) {
            log.error("Datastore does not contain document: ", fingerprint);
            return null;
        }

        let statePathStat = await Files.statAsync(statePath);

        if( ! statePathStat.isFile() ) {
            log.error("Path is not a file: ", statePath);
            return null;
        }

        let canAccess =
            await Files.accessAsync(statePath, fs.constants.R_OK | fs.constants.W_OK)
                      .then(() => true)
                      .catch(() => false);

        if(! canAccess) {
            log.error("No access: ", statePath);
            return null;
        }

        let buffer = await Files.readFileAsync(statePath);

        return buffer.toString('utf8');

    }

    /**
     * Write the datastore to disk.
     */
    async sync(fingerprint: string, data: string) {

        Preconditions.assertTypeOf(data, "string", "data");

        log.info("Performing sync of content into disk datastore");

        let docDir = FilePaths.join(this.dataDir, fingerprint);

        let docDirExists = await Files.existsAsync(docDir);

        log.debug(`Doc dir ${docDir} exists: ${docDirExists}`);

        if ( ! docDirExists) {
            log.debug(`Doc dir does not exist. Creating ${docDir}`);
            await Files.mkdirAsync(docDir);
        }

        log.debug("Calling stat on docDir: " + docDir);
        let stat = await Files.statAsync(docDir);

        if(! stat.isDirectory()) {
            throw new Error("Path is not a directory: " + docDir);
        }

        let statePath = FilePaths.join(docDir, "state.json");

        log.info(`Writing data to state file: ${statePath}`);

        // FIXME: is this UTF-8 ??

        return await Files.writeFileAsync(statePath, data);

    }

    async getDocMetaFiles(): Promise<DocMetaRef[]> {

        if( ! await Files.existsAsync(this.dataDir)) {
            // no data dir but this should rarely happen.
            return [];
        }

        let fileNames = await Files.readdirAsync(this.dataDir);

        let result: DocMetaRef[] = [];

        for (let i = 0; i < fileNames.length; i++) {
            const fileName = fileNames[i];

            let docMetaDir = FilePaths.join(this.dataDir, fileName);
            const docMetaDirStat = await Files.statAsync(docMetaDir);

            if(docMetaDirStat.isDirectory()) {

                let stateFile = FilePaths.join(this.dataDir, fileName, 'state.json');

                let exists = await Files.existsAsync(stateFile);
                if (exists) {
                    result.push({fingerprint: fileName});
                }

            }

        }

        return result;
    }

    static getUserHome() {

        let result = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];

        if(!result) {
            result = os.homedir();
        }

        return result;
    }

    static getDataDir() {
        return FilePaths.join(DiskDatastore.getUserHome()!, ".polar");
    }

}
