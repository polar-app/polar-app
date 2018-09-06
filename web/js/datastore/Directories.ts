/**
 * Represents key local directories for Polar when running locally.
 */
import {DataDir, DataDirConfig, DiskDatastore} from './DiskDatastore';
import {CreateDirResult, Files} from '../util/Files';
import {FilePaths} from '../util/FilePaths';
import {isPresent} from '../Preconditions';

export class Directories {

    public readonly dataDir: string;
    public readonly stashDir: string;
    public readonly logsDir: string;
    public readonly configDir: string;
    /**
     * Expose the DataDirConfig so tests and other systems can see how the
     * dataDir was setup for the DiskDatastore.
     */
    public readonly dataDirConfig: DataDirConfig;

    public initialization?: Initialization;

    constructor(dataDir?: string) {

        if (dataDir) {
            // use a configured dataDir for testing.
            this.dataDirConfig = {path: dataDir, strategy: 'manual'};
        } else {
            this.dataDirConfig = Directories.getDataDir();
        }

        this.dataDir = this.dataDirConfig.path;

        // the path to the stash directory
        this.stashDir = FilePaths.create(this.dataDir, "stash");
        this.logsDir = FilePaths.create(this.dataDir, "logs");
        this.configDir = FilePaths.create(this.dataDir, "config");

    }

    public async init() {

        this.initialization = {
            dataDir: await Files.createDirAsync(this.dataDir),
            stashDir: await Files.createDirAsync(this.stashDir),
            logsDir: await Files.createDirAsync(this.logsDir),
            configDir: await Files.createDirAsync(this.configDir)
        };

        return this;

    }

    public static getDataDir(): DataDirConfig {

        let dataDirs: DataDir[] = [
            {
                path: process.env.POLAR_DATA_DIR,
                strategy: 'env'
            },
            {
                path: FilePaths.join(DiskDatastore.getUserHome(), ".polar"),
                strategy: 'home',
            }
        ];

        dataDirs = dataDirs.filter(current => isPresent(current.path));

        const dataDir = dataDirs[0];

        return {
            path: dataDir.path!,
            strategy: dataDir.strategy
        };

    }

}

/**
 * Results of initialization:
 */
export interface Initialization {
    readonly dataDir: CreateDirResult;
    readonly stashDir: CreateDirResult;
    readonly logsDir: CreateDirResult;
    readonly configDir: CreateDirResult;
}
