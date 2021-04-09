import {
    AbstractDatastore,
    AbstractPrefsProvider,
    BinaryFileData,
    Datastore,
    DatastoreCapabilities,
    DatastoreInfo,
    DatastoreOverview,
    DefaultWriteFileOpts,
    DeleteResult,
    DocMetaSnapshotEventListener,
    ErrorListener,
    InitResult,
    PrefsProvider,
    SnapshotResult,
    WriteFileOpts,
    WriteOpts
} from './Datastore';
import {isPresent, Preconditions} from 'polar-shared/src/Preconditions';
import {Logger} from 'polar-shared/src/logger/Logger';
import {DocMetaFileRef, DocMetaRef} from './DocMetaRef';
import {FileDeleted, FileHandle, Files} from 'polar-shared/src/util/Files';
import {FilePaths} from 'polar-shared/src/util/FilePaths';
import {Directories} from './Directories';

import fs from 'fs';
import os from 'os';

import {Backend} from 'polar-shared/src/datastore/Backend';
import {DocFileMeta} from 'polar-shared/src/datastore/DocFileMeta';
import {Optional} from 'polar-shared/src/util/ts/Optional';
import {Platform, Platforms} from "polar-shared/src/util/Platforms";
import {DatastoreFiles} from './DatastoreFiles';
import {DatastoreMutation, DefaultDatastoreMutation} from './DatastoreMutation';
import {Datastores} from './Datastores';
import {NULL_FUNCTION} from 'polar-shared/src/util/Functions';
import {ISODateTimeStrings} from 'polar-shared/src/metadata/ISODateTimeStrings';
import {Stopwatches} from 'polar-shared/src/util/Stopwatches';
import {
    DictionaryPrefs,
    IPersistentPrefs,
    StringToPrefDict
} from '../util/prefs/Prefs';
import {DatastoreMutations} from './DatastoreMutations';
import {IDocInfo} from 'polar-shared/src/metadata/IDocInfo';
import {IDocMeta} from "polar-shared/src/metadata/IDocMeta";
import {FileRef} from "polar-shared/src/datastore/FileRef";
import {Strings} from "polar-shared/src/util/Strings";
import {Mutexes} from "polar-shared/src/util/Mutexes";
import {DocMetas} from "../metadata/DocMetas";
import {GetFileOpts, NetworkLayer} from "polar-shared/src/datastore/IDatastore";

const log = Logger.create();

const writeMutex = Mutexes.create();

export class DiskDatastore extends AbstractDatastore implements Datastore {

    public readonly id = 'disk';

    public readonly dataDir: string;

    public readonly stashDir: string;

    public readonly filesDir: string;

    public readonly logsDir: string;

    public readonly dataDirConfig: DataDirConfig;

    public readonly directories: Directories;

    private readonly diskPersistentPrefsBacking: DiskPersistentPrefsBacking;
    private prefs: DiskPersistentPrefsProviderImpl | undefined;

    constructor() {

        super();

        // TODO: migrate this to use Directories

        this.directories = new Directories();

        // the path to the stash directory
        this.dataDir = this.directories.dataDir;
        this.dataDirConfig = this.directories.dataDirConfig;
        this.stashDir = this.directories.stashDir;
        this.filesDir = this.directories.filesDir;
        this.logsDir = this.directories.logsDir;
        this.diskPersistentPrefsBacking = new DiskPersistentPrefsBacking(this.directories);

    }

    public async init(errorListener: ErrorListener = NULL_FUNCTION): Promise<DiskInitResult> {

        const diskInitResult = await this.directories.init();

        const doInitInfo = async () => {

            const hasDatastoreInfo = async () => {

                const datastoreInfo = await this.info();

                return datastoreInfo.isPresent();

            };

            if (await hasDatastoreInfo()) {
                // we're already done.
                return;
            }

            const stopwatch = Stopwatches.create();

            const docMetaRefs = await this.getDocMetaRefs();

            const addedValues: string[] = [];

            for (const docMetaRef of docMetaRefs) {

                const data = await this.getDocMeta(docMetaRef.fingerprint);

                if (data) {

                    try {
                        const docMeta: IDocMeta = JSON.parse(data);

                        if (docMeta && docMeta.docInfo && docMeta.docInfo.added) {
                            addedValues.push(docMeta.docInfo.added);
                        }

                    } catch (e) {
                        log.warn("Unable to parse doc meta with fingerprint: " + docMetaRef.fingerprint);
                    }

                }

            }

            const created = addedValues.length > 0 ? addedValues.sort()[0] : ISODateTimeStrings.create();

            const datastoreInfo: DatastoreInfo = {created};

            const msg = "Writing new datastore info: " + JSON.stringify(datastoreInfo);

            log.info(msg);

            await this.writeInfo(datastoreInfo);

            log.info(msg + " ... " + stopwatch.stop());

        };

        await doInitInfo();

        await this.initPrefs();

        return diskInitResult;
    }

    private async initPrefs() {

        if (! this.prefs) {
            await this.diskPersistentPrefsBacking.init();
            this.prefs = new DiskPersistentPrefsProviderImpl(this.diskPersistentPrefsBacking);
        }

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

        const deleteDelegate = async () => {

            const docDir = FilePaths.join(this.dataDir, docMetaFileRef.fingerprint);
            const statePath = FilePaths.join(docDir, 'state.json');

            let deleteFilePromise: Promise<void> = Promise.resolve();

            if (docMetaFileRef.docFile && docMetaFileRef.docFile.name) {
                deleteFilePromise = this.deleteFile(Backend.STASH, docMetaFileRef.docFile);
            }

            log.info(`Deleting statePath ${statePath} and file: `, docMetaFileRef.docFile);

            // TODO: don't delete JUST the state file but also the parent dir if it
            // is empty.

            const deleteStatePathPromise = Files.deleteAsync(statePath);

            log.debug("Waiting for state delete...");
            const docMetaFile = await deleteStatePathPromise;
            log.debug("Waiting for state delete...done");

            log.debug("Waiting for file delete...");
            await deleteFilePromise;
            log.debug("Waiting for file delete...done");

            return {
                docMetaFile
            };

        };

        return await DatastoreMutations.handle(async () => deleteDelegate(), datastoreMutation, () => true);

    }

    /**
     * Get the DocMeta object we currently in the datastore for this given
     * fingerprint or null if it does not exist.
     */
    public async getDocMeta(fingerprint: string): Promise<string | null> {

        const docDir = FilePaths.join(this.dataDir, fingerprint);
        const statePath = FilePaths.join(docDir, 'state.json');

        if (! await this.contains(fingerprint)) {
            // just return null and do not log any errors as this is an
            // acceptable return type.  If the document is NOT in the repository
            // here we return null.  We used to call contains() and then
            // getDocMeta() and avoided the getDocMeta call but this actually
            // was slow on Firebase so we just call getDocMeta but this
            // triggered an error log here.  It's completely acceptable to
            // call getDocMeta on something that may not exist and just get
            // back a null value.
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
                           data: BinaryFileData,
                           opts: WriteFileOpts = new DefaultWriteFileOpts()): Promise<DocFileMeta> {

        if (! isPresent(data)) {

            if (opts.updateMeta) {

                // this is a metadata update and is not valid for the disk data
                // store so we have no work to do.
                return this.getFile(backend, ref);

            } else {
                // when the caller specifies null they mean that there's a
                // metadata update which needs to be applied.
                throw new Error("No data present");
            }

        }

        const meta = opts.meta || {};

        DatastoreFiles.assertSanitizedFileName(ref);

        const fileReference = this.createFileReference(backend, ref);

        // this would create the parent dir for the file when it does not exist.
        await Files.createDirAsync(fileReference.dir);

        // TODO maybe make this accept a function that creates a readable stream.
        type DiskBinaryFileData = FileHandle | Buffer | string | NodeJS.ReadableStream;

        const diskData = <DiskBinaryFileData> data;

        await Files.writeFileAsync(fileReference.path, diskData, {existing: 'link'});

        await Files.writeFileAsync(fileReference.metaPath, JSON.stringify(meta, null, '  '), {atomic: true});

        return this.createDatastoreFile(backend, ref, fileReference);

    }

    public getFile(backend: Backend, ref: FileRef, opts: GetFileOpts = {}): DocFileMeta {

        Datastores.assertNetworkLayer(this, opts.networkLayer);

        DatastoreFiles.assertSanitizedFileName(ref);

        const fileReference = this.createFileReference(backend, ref);

        return this.createDatastoreFile(backend, ref, fileReference);

    }

    public containsFile(backend: Backend, ref: FileRef): Promise<boolean> {
        DatastoreFiles.assertSanitizedFileName(ref);
        const fileReference = this.createFileReference(backend, ref);
        return Files.existsAsync(fileReference.path);
    }

    public async deleteFile(backend: Backend, ref: FileRef): Promise<void> {

        DatastoreFiles.assertSanitizedFileName(ref);

        const fileReference = this.createFileReference(backend, ref);

        await Files.removeAsync(fileReference.path);
        await Files.removeAsync(fileReference.metaPath);

    }

    /**
     * Write the datastore to disk.
     */
    public async write(fingerprint: string,
                       data: string,
                       docInfo: IDocInfo,
                       opts: WriteOpts = {}) {

        const datastoreMutation = opts.datastoreMutation || new DefaultDatastoreMutation();

        const writeDelegate = async () => {

            await this.handleWriteFile(opts);

            Preconditions.assertPresent(data, "data");
            Preconditions.assertTypeOf(data, "string", "data", () => log.error("Failed with data: ", data));

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

            // TODO: don't write directly to state.json... instead write to
            // state.json.new, then delete state.json, then move state.json.new to
            // state.json..  This way we can create backups using hard links easily.

            await Files.writeFileAsync(statePath, data, {encoding: 'utf8', atomic: true});

        };

        // write this using a write mutex so that on Windows we don't have any race
        // conditions writing files.
        await writeMutex.execute(async () => {
            await DatastoreMutations.handle(async () => writeDelegate(), datastoreMutation, () => true);
        });

    }

    public async getDocMetaRefs(): Promise<ReadonlyArray<DocMetaRef>> {

        if ( ! await Files.existsAsync(this.dataDir)) {
            // no data dir but this should rarely happen.
            return [];
        }

        const fingerprints = await Files.readdirAsync(this.dataDir);

        const result: DocMetaRef[] = [];

        for ( const fingerprint of fingerprints) {

            const docMetaDir = FilePaths.join(this.dataDir, fingerprint);
            const docMetaDirStat = await Files.statAsync(docMetaDir);

            if (docMetaDirStat.isDirectory()) {

                const stateFile = FilePaths.join(this.dataDir, fingerprint, 'state.json');

                const exists = await Files.existsAsync(stateFile);

                if (exists) {
                    result.push({
                        fingerprint,
                        docMetaProvider: async () => {
                            const data = await this.getDocMeta(fingerprint);
                            return DocMetas.deserialize(data!, fingerprint);
                        }
                    });
                }

            }

        }

        return result;
    }

    public async snapshot(docMetaSnapshotEventListener: DocMetaSnapshotEventListener,
                          errorListener: ErrorListener = NULL_FUNCTION): Promise<SnapshotResult> {

        return Datastores.createCommittedSnapshot(this, docMetaSnapshotEventListener);

    }


    public async createBackup(): Promise<void> {

        const dataDir = this.directories.dataDir;

        const now = new Date();

        const ordYear = now.getUTCFullYear();
        const ordMonth = now.getUTCMonth() + 1;
        const ordDay = now.getUTCDate();

        const year = Strings.lpad(ordYear, '0', 4);
        const month = Strings.lpad(ordMonth, '0', 2);
        const day = Strings.lpad(ordDay, '0', 2);

        const backupDir = FilePaths.join(dataDir, `.backup-${year}-${month}-${day}`);

        const acceptPredicate = (path: string) => {
            return path.indexOf(".backup-") === -1;
        };

        if (await Files.existsAsync(backupDir)) {
            log.warn("Not creating backup.  Already exists: ", backupDir);
        } else {
            log.notice("Creating backup to: " + backupDir);
            await Files.createDirectorySnapshot(dataDir, backupDir, acceptPredicate);
        }

    }

    public addDocMetaSnapshotEventListener(docMetaSnapshotEventListener: DocMetaSnapshotEventListener): void {
        // noop now
    }

    /**
     * Get the info from the datastore.
     */
    public async info(): Promise<Optional<DatastoreInfo>> {

        const infoPath = FilePaths.join(this.dataDir, 'info.json');

        if (await Files.existsAsync(infoPath)) {

            const data = await Files.readFileAsync(infoPath);

            try {

                const result = <DatastoreInfo> JSON.parse(data.toString('utf-8'));

                return Optional.of(result);

            } catch (e) {

                // data is invalid so delete it so it's re-created later
                await Files.deleteAsync(infoPath);

                log.warn("Unable to read info.json file.");
                return Optional.empty();

            }

        }

        return Optional.empty();
    }

    public async overview(): Promise<DatastoreOverview> {

        const docMetaRefs = await this.getDocMetaRefs();

        const datastoreInfo = await this.info();

        const created = datastoreInfo.map(info => info.created).getOrUndefined();

        return {nrDocs: docMetaRefs.length, created};

    }

    public capabilities(): DatastoreCapabilities {

        const networkLayers = new Set<NetworkLayer>(['local']);

        return {
            networkLayers,
            permission: {mode: 'rw'}
        };

    }

    private async writeInfo(datastoreInfo: DatastoreInfo) {

        const infoPath = FilePaths.join(this.dataDir, 'info.json');

        const json = JSON.stringify(datastoreInfo, null, "  ");

        await Files.writeFileAsync(infoPath, json, {atomic: true});

    }

    public getPrefs(): PrefsProvider {

        if (this.prefs) {
            return this.prefs;
        } else {
            throw new Error("No prefs. Not initialized yet.");
        }

    }

    private createDatastoreFile(backend: Backend,
                                ref: FileRef,
                                fileReference: DiskFileReference): DocFileMeta {

        const fileURL = FilePaths.toURL(fileReference.path);
        const url = new URL(fileURL);

        // if (await Files.existsAsync(fileReference.metaPath)) {
        //     const buff = await Files.readFileAsync(fileReference.metaPath);
        //     meta = JSON.parse(buff.toString("utf-8"));
        // }

        return {
            backend,
            ref,
            url: url.href,
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

export interface InitOptions {

    /**
     * Perform a snapshot on init if
     */
    readonly initialSnapshotRequired: boolean;

}

export class DiskPersistentPrefsBacking {

    private prefs: DiskPersistentPrefs;

    private readonly directories: Directories;

    private readonly path: string;

    constructor(directories: Directories) {
        this.directories = directories;
        this.prefs = new DiskPersistentPrefs(this);
        this.path = FilePaths.create(this.directories.configDir, "prefs.json");
    }

    public async init() {

        if (await Files.existsAsync(this.path)) {
            log.info("Loaded prefs from: " + this.path);
            const data = await Files.readFileAsync(this.path);
            const prefs: StringToPrefDict = JSON.parse(data.toString("utf-8"));

            this.prefs = new DiskPersistentPrefs(this, prefs);
        }

    }

    public async commit(): Promise<void> {
        const data = JSON.stringify(this.prefs.toPrefDict(), null, "  ");
        await Files.writeFileAsync(this.path, data, {atomic: true});
    }

    public get() {
        return this.prefs;
    }


}

/**
 * Prefs object just backed by a local dictionary.
 */
export class DiskPersistentPrefs extends DictionaryPrefs implements IPersistentPrefs {

    private readonly diskPrefsStore: DiskPersistentPrefsBacking;

    constructor(diskPrefsStore: DiskPersistentPrefsBacking,
                delegate: StringToPrefDict = {}) {
        super(delegate);
        this.diskPrefsStore = diskPrefsStore;
    }

    public async commit(): Promise<void> {
        return await this.diskPrefsStore.commit();
    }

}

class DiskPersistentPrefsProviderImpl extends AbstractPrefsProvider {

    constructor(private readonly backing: DiskPersistentPrefsBacking) {
        super();
    }

    public get(): IPersistentPrefs {
        return this.createInterceptedPersistentPrefs(this.backing.get())!;
    }

}
