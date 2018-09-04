import {Datastore} from './Datastore';
import {Preconditions} from '../Preconditions';
import {Logger} from '../logger/Logger';
import {DocMetaRef} from './DocMetaRef';
import {Files} from '../util/Files';
import {FilePaths} from '../util/FilePaths';

const fs = require("fs");
const os = require("os");

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
     * Get the DocMeta object we currently in the datastore for this given
     * fingerprint or null if it does not exist.
     */
    async getDocMeta(fingerprint: string): Promise<string | null> {

        let docDir = FilePaths.join(this.dataDir, fingerprint);

        if(! await Files.existsAsync(docDir)) {
            log.error("Document dir is missing: " + docDir);
            return null;
        }

        let statePath = FilePaths.join(docDir, 'state.json');

        if(! await Files.existsAsync(statePath)) {
            log.error("File does not exist: " + statePath);
            return null;
        }

        let statePathStat = await Files.statAsync(statePath);

        if( ! statePathStat.isFile() ) {
            log.error("Path is not a file: " + statePath);
            return null;
        }

        let canAccess =
            await Files.accessAsync(statePath, fs.constants.R_OK | fs.constants.W_OK)
                      .then(() => true)
                      .catch(() => false);

        if(! canAccess) {
            log.error("No access: " + statePath);
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

        log.info("Performing sync of content into disk datastore.");

        let docDir = FilePaths.join(this.dataDir, fingerprint);

        let dirExists = Files.existsAsync(docDir);

        if ( ! dirExists) {
            // the directory for this file is missing.
            log.info(`Doc dir does not exist. Creating ${docDir}`);
            await Files.mkdirAsync(docDir)
        }

        let stat = await Files.statAsync(docDir);

        if(! stat.isDirectory()) {
            throw new Error("File is not a directory: " + docDir);;
        }

        let statePath = FilePaths.join(docDir, "state.json");

        log.info(`Writing data to state file: ${statePath}`);

        // FIXME: is this UTF-8 ??

        return await Files.writeFileAsync(statePath, data);

    }

    async getDocMetaFiles(): Promise<DocMetaRef[]> {

        let fileNames = await Files.readdirAsync(this.dataDir);

        let result: DocMetaRef[] = [];

        for (let i = 0; i < fileNames.length; i++) {
            const fileName = fileNames[i];

            const fileStat = await Files.statAsync(FilePaths.join(this.dataDir, fileName));

            if(fileStat.isDirectory()) {

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
