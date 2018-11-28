import {Datastore, DeleteResult, FileMeta, FileRef, InitResult,
        DocMetaSnapshotEvent, DocMetaMutation, DocMetaSnapshotEventListener,
        SnapshotResult, DocMetaSnapshotBatch, ErrorListener} from './Datastore';
import {isPresent, Preconditions} from '../Preconditions';
import {Logger} from '../logger/Logger';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {FileDeleted, FileHandle, Files} from '../util/Files';
import {FilePaths} from '../util/FilePaths';
import {Directories} from './Directories';

import fs from 'fs';
import os from 'os';

import {Backend} from './Backend';
import {DatastoreFile} from './DatastoreFile';
import {Optional} from '../util/ts/Optional';
import {DocInfo} from '../metadata/DocInfo';
import {Platform, Platforms} from "../util/Platforms";
import {DatastoreFiles} from './DatastoreFiles';
import {DatastoreMutation, DefaultDatastoreMutation} from './DatastoreMutation';
import {DatastoreMutations} from './DatastoreMutations';
import {DocMetas} from '../metadata/DocMetas';
import {Datastores} from './Datastores';
import {NULL_FUNCTION} from '../util/Functions';

const log = Logger.create();

export class DiskDatastore implements Datastore {

    public readonly id = 'disk';

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

    public async init(errorListener: ErrorListener = NULL_FUNCTION): Promise<DiskInitResult> {
        return await this.directories.init();
    }

    public async stop() {
        // noop
    }

    /**
     * Return true if the DiskDatastore contains a document for the given
     * fingerprint.
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
    public async delete(docMetaFileRef: DocMetaFileRef,
                        datastoreMutation: DatastoreMutation<boolean> = new DefaultDatastoreMutation()):
        Promise<Readonly<DiskDeleteResult>> {

        const docDir = FilePaths.join(this.dataDir, docMetaFileRef.fingerprint);
        const statePath = FilePaths.join(docDir, 'state.json');

        let docPath: string | undefined;

        if (docMetaFileRef.docFile && docMetaFileRef.docFile.name) {

            // FIXME: remove this via deleteFile NOT delete since I'm storing
            // it as a binary file now.
            docPath = FilePaths.join(this.directories.stashDir, docMetaFileRef.docFile.name);

        }

        log.info(`Deleting statePath ${statePath} and docPath ${docPath}`);

        // TODO: don't delete JUST the state file but also the parent dir if it
        // is empty.

        const deleteStatePathPromise = Files.deleteAsync(statePath);
        const deleteDocPathPromise = docPath !== undefined ? Files.deleteAsync(docPath) : Promise.resolve(undefined);

        // now handle all the promises with the datastore mutation so that we
        // can verify that we were written and committed.
        DatastoreMutations.handle(Promise.all([ deleteStatePathPromise, deleteDocPathPromise]),
                                  datastoreMutation,
                                  () => true);

        return {
            docMetaFile: await deleteStatePathPromise,
            dataFile: await deleteDocPathPromise
        };

    }

    /**
     * Get the DocMeta object we currently in the datastore for this given
     * fingerprint or null if it does not exist.
     */
    public async getDocMeta(fingerprint: string): Promise<string | null> {

        const docDir = FilePaths.join(this.dataDir, fingerprint);
        const statePath = FilePaths.join(docDir, 'state.json');

        if (! await this.contains(fingerprint)) {
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

    public async writeFile(backend: Backend,
                           ref: FileRef,
                           data: FileHandle | Buffer | string,
                           meta: FileMeta = {}): Promise<DatastoreFile> {

        DatastoreFiles.assertSanitizedFileName(ref);

        const fileReference = this.createFileReference(backend, ref);

        // this would create the parent dir for the file when it does not exist.
        await Files.createDirAsync(fileReference.dir);

        await Files.writeFileAsync(fileReference.path, data);

        await Files.writeFileAsync(fileReference.metaPath, JSON.stringify(meta, null, '  '));

        return this.createDatastoreFile(backend, ref, fileReference);

    }

    public async getFile(backend: Backend, ref: FileRef): Promise<Optional<DatastoreFile>> {

        DatastoreFiles.assertSanitizedFileName(ref);

        const fileReference = this.createFileReference(backend, ref);

        if (await Files.existsAsync(fileReference.path)) {
            const datastoreFile = await this.createDatastoreFile(backend, ref, fileReference);
            return Optional.of(datastoreFile);
        } else {
            return Optional.empty();
        }

    }

    public containsFile(backend: Backend, ref: FileRef): Promise<boolean> {
        DatastoreFiles.assertSanitizedFileName(ref);
        const fileReference = this.createFileReference(backend, ref);
        return Files.existsAsync(fileReference.path);
    }

    public deleteFile(backend: Backend, ref: FileRef): Promise<void> {

        DatastoreFiles.assertSanitizedFileName(ref);

        const fileReference = this.createFileReference(backend, ref);

        return Files.removeAsync(fileReference.path);
    }

    /**
     * Write the datastore to disk.
     */
    public async write(fingerprint: string,
                       data: string,
                       docInfo: DocInfo,
                       datastoreMutation: DatastoreMutation<boolean> = new DefaultDatastoreMutation()) {

        Preconditions.assertTypeOf(data, "string", "data");

        if (data.length === 0) {
            throw new Error("Invalid data");
        }

        if (data[0] !== '{') {
            throw new Error("Not JSON");
        }

        log.info("Performing sync of content into disk datastore");

        const docDir = FilePaths.join(this.dataDir, fingerprint);

        await Files.createDirAsync(docDir);

        log.debug("Calling stat on docDir: " + docDir);
        const stat = await Files.statAsync(docDir);

        if (! stat.isDirectory()) {
            throw new Error("Path is not a directory: " + docDir);
        }

        const statePath = FilePaths.join(docDir, "state.json");

        log.info(`Writing data to state file: ${statePath}`);

        const result = Files.writeFileAsync(statePath, data, {encoding: 'utf8'});

        DatastoreMutations.handle(result, datastoreMutation, () => true);

        return result;

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

    public async snapshot(docMetaSnapshotEventListener: DocMetaSnapshotEventListener,
                          errorListener: ErrorListener = NULL_FUNCTION): Promise<SnapshotResult> {

        return Datastores.createCommittedSnapshot(this, docMetaSnapshotEventListener);

    }

    private async createDatastoreFile(backend: Backend,
                                      ref: FileRef,
                                      fileReference: DiskFileReference): Promise<DatastoreFile> {

        // TODO: test that this works on Windows - I do not think it will.
        const url = new URL(`file:///${fileReference.path}`);

        const buff = await Files.readFileAsync(fileReference.metaPath);
        const meta = JSON.parse(buff.toString("utf-8"));

        return {
            backend,
            ref,
            url: url.href,
            meta
        };

    }

    private createFileReference(backend: Backend, ref: FileRef): DiskFileReference {

        let dir;

        if (backend === Backend.STASH) {
            dir = FilePaths.join(this.dataDir, backend.toString().toLowerCase());
        } else {
            dir = FilePaths.join(this.filesDir, backend.toString().toLowerCase());
        }

        const path = FilePaths.join(dir, ref.name);
        const metaPath = FilePaths.join(dir, ref.name + '.meta');

        return {dir, path, metaPath};

    }

    public static getDataDirs() {

        const userHome = this.getUserHome();

        const platform = Platforms.get();

        return this.getDataDirsForPlatform({userHome, platform});

    }

    public static async determineProperDirectory(directorySet: DirectorySet): Promise<string> {

        // see if any of the paths exist, by order and prefer the directories
        // that already exist.
        for (const path of directorySet.paths) {

            if (await Files.existsAsync(path)) {
                return path;
            }

        }

        // if none of the paths exist, use the preferred path.
        return directorySet.preferredPath;

    }

    /**
     * Get all data dirs for a given platform.  There might be multiple
     * locations per platform depending on earlier versions of Polar so
     * we return all possible directories and we can test which ones exist
     * and use the preferred directory if none exist.
     *
     * The preferred data directories are always in Polar/Data.  The reason we
     * always include /Data is that Electron likes to create a directory name
     * for the app and store chrome data in that directory.  This way the
     * Polar data is sandboxed into its own Data directory seperate from the
     * chromium user profile data.
     *
     */
    public static getDataDirsForPlatform(dirRuntime: DirRuntime): DirectorySet {

        const {userHome, platform} = dirRuntime;

        switch (platform) {

            case Platform.WINDOWS: {

                // TODO: consider using AppData/Local BUT the AppData is hidden
                // on Windows so that might increase support costs.

                // TODO: can't use Polar/Data as it might implement a bug with
                // two level nested dirs.

                // TODO: I don't like Polar-Data for the name

                // TODO: I could just write to the app directory that Electron
                // wants me to write to and into a Data directory there but
                // I don't like combining them.

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

                const preferredPath = FilePaths.join(userHome, ".config", "Polar");

                return {
                    paths: [
                        FilePaths.join(userHome, ".polar"),
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
 * Information about the directories used in the current runtime / OS.
 */
export interface DirRuntime {
    readonly userHome: string;
    readonly platform: Platform;

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

export interface DiskDeleteResult extends DeleteResult {

    docMetaFile: Readonly<FileDeleted>;

    dataFile?: Readonly<FileDeleted>;

}

type DirStrategy = 'env' | 'home' | 'manual';

interface DiskFileReference {

    // the dir holding our files.
    dir: string;

    // the full path to the actual data file.
    path: string;

    // the full path to the metadata file (file.meta)
    metaPath: string;

}

export interface DiskInitResult extends InitResult {

}
