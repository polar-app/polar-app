import {Datastore, FileMeta} from './Datastore';
import {Preconditions} from '../Preconditions';
import {Logger} from '../logger/Logger';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {FileDeleted, Files} from '../util/Files';
import {FilePaths} from '../util/FilePaths';
import {Directories} from './Directories';

import fs from 'fs';
import os from 'os';

import {Backend} from './Backend';
import {DatastoreFile} from './DatastoreFile';
import {Optional} from '../util/ts/Optional';
import {DocInfo} from '../metadata/DocInfo';
import {Platform, Platforms} from "../util/Platforms";

const log = Logger.create();

export class DiskDatastore implements Datastore {

    public readonly dataDir: string;

    public readonly stashDir: string;

    public readonly filesDir: string;

    public readonly logsDir: string;

    public readonly dataDirConfig: DataDirConfig;

    public readonly directories: Directories;

    constructor() {

        // TODO: migrate this to use Directories

        this.directories = new Directories();

        // the path to the stash directory
        this.dataDir = this.directories.dataDir;
        this.dataDirConfig = this.directories.dataDirConfig;
        this.stashDir = this.directories.stashDir;
        this.filesDir = this.directories.filesDir;
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

        const docPath = FilePaths.join(this.directories.stashDir, docMetaFileRef.filename);

        log.info(`Deleting statePath ${statePath} and docPath ${docPath}`);

        return {
            docMetaFile: await Files.deleteAsync(statePath),
            dataFile: await Files.deleteAsync(docPath)
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


    public async addFile(backend: Backend, name: string, data: Buffer | string, meta: FileMeta = {}): Promise<DatastoreFile> {

        DiskDatastore.assertFileName(name);

        const fileReference = this.createFileReference(backend, name);

        // this would create the parent dir for the file when it does not exist.
        await Files.createDirAsync(fileReference.dir);

        await Files.writeFileAsync(fileReference.path, data);

        await Files.writeFileAsync(fileReference.metaPath, JSON.stringify(meta, null, '  '));

        return this.createDatastoreFile(name, fileReference);

    }

    public async getFile(backend: Backend, name: string): Promise<Optional<DatastoreFile>> {

        DiskDatastore.assertFileName(name);

        const fileReference = this.createFileReference(backend, name);

        if (await Files.existsAsync(fileReference.path)) {
            const datastoreFile = await this.createDatastoreFile(name, fileReference);
            return Optional.of(datastoreFile);
        } else {
            return Optional.empty();
        }

    }

    public containsFile(backend: Backend, name: string): Promise<boolean> {

        DiskDatastore.assertFileName(name);

        const path = FilePaths.join(this.filesDir, backend.toString().toLowerCase(), name);
        return Files.existsAsync(path);
    }

    /**
     * Write the datastore to disk.
     */
    public async sync(fingerprint: string, data: string, docInfo: DocInfo) {

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

    public static assertFileName(name: string) {

        if (! this.validateFileName(name)) {
            throw new Error("Invalid file name: " + name);
        }

    }

    /**
     * Make sure the file name is sane ... nothing that can't be encoded
     * as a file and must have a three letter extension.  We should just have
     * the files be alphanumeric for now and support a 3-4 char suffix.
     */
    public static validateFileName(name: string): boolean {
        return name.search(/^[a-zA-Z0-9]+(\.[a-zA-Z0-9]{3,4})?$/g) !== -1;

    }

    private async createDatastoreFile(name: string, fileReference: FileReference): Promise<DatastoreFile> {

        const url = new URL(`file:///${fileReference.path}`);

        const buff = await Files.readFileAsync(fileReference.metaPath);
        const meta = JSON.parse(buff.toString("utf-8"));

        return {
            name,
            url: url.href,
            meta
        };

    }

    private createFileReference(backend: Backend, name: string): FileReference {

        const dir = FilePaths.join(this.filesDir, backend.toString().toLowerCase());
        const path = FilePaths.join(dir, name);
        const metaPath = FilePaths.join(dir, name + '.meta');

        return {dir, path, metaPath};

    }

    public static getDataDirs() {
        return this.getDataDirsForPlatform(Platforms.get());
    }

    /**
     * Get all data dirs for a given platform.  There might be multiple
     * locations per platform depending on earlier versions of Polar so
     * we return all possible directories and we can test which ones exist
     * and use the preferred directory if none exist.
     *
     * @param platform
     */
    public static getDataDirsForPlatform(platform: Platform): DirectorySet {

        const userHome = this.getUserHome();

        switch (platform) {

            case Platform.WINDOWS: {

                // TODO: consider using AppData
                const preferredPath = FilePaths.join(userHome, "Polar");

                return {
                    paths: [
                        FilePaths.join(userHome, ".polar"),
                        preferredPath
                    ],
                    preferredPath
                };

            }

            case Platform.LINUX: {

                const preferredPath = FilePaths.join(userHome, ".polar");

                return {
                    paths: [
                        preferredPath,
                    ],
                    preferredPath
                };

            }

            case Platform.MACOS: {

                const preferredPath = FilePaths.join(userHome, "Library", "Application Support", "Polar");

                return {
                    paths: [
                        FilePaths.join(userHome, ".polar"),
                        preferredPath,
                    ],
                    preferredPath
                };

            }

            default:
                throw new Error("Platform not supported: " + platform);

        }

    }

    public static getUserHome() {

        const ENV_NAME =
            process.platform === 'win32' ? 'USERPROFILE' : 'HOME';

        let result = process.env[ENV_NAME];

        if (!result) {
            result = os.homedir();
        }

        return result;
    }

}

/**
 * A set of directories for a given platform.
 */
export interface DirectorySet {

    /**
     * All paths that might exist.
     */
    readonly paths: string[];

    /**
     * The preferred path to use is none currently exist.
     */
    readonly preferredPath: string;

}

export interface DataDir {

    /**
     * The path to the data dir.
     */
    path: string | undefined | null;

    /**
     * How the data dir was configured.
     */
    strategy: DirStrategy;

}

export interface DataDirConfig {

    path: string;

    /**
     * How the data dir was configured.
     */
    strategy: DirStrategy;

}

export interface DeleteResult {

    docMetaFile: Readonly<FileDeleted>;

    dataFile: Readonly<FileDeleted>;

}

type DirStrategy = 'env' | 'home' | 'manual';

interface FileReference {

    // the dir holding our files.
    dir: string;

    // the path to the data file.
    path: string;

    // the path to the metadata file.
    metaPath: string;

}

