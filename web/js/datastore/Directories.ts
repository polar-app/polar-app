/**
 * Represents key local directories for Polar when running locally.
 */
import {DiskDatastore} from './DiskDatastore';
import {Paths} from '../util/Paths';
import {CreateDirResult, Files} from '../util/Files';

export class Directories {

    public readonly dataDir: string;
    public readonly stashDir: string;
    public readonly logsDir: string;
    public readonly configDir: string;

    public initialization?: Initialization;

    constructor(dataDir?: string) {

        if(dataDir) {
            // use a configured dataDir for testing.
            this.dataDir = dataDir;
        } else {
            this.dataDir = DiskDatastore.getDataDir();
        }

        // the path to the stash directory
        this.stashDir = Paths.create(this.dataDir, "stash");
        this.logsDir = Paths.create(this.dataDir, "logs");
        this.configDir = Paths.create(this.dataDir, "config");

    }

    async init() {

        this.initialization = {
            dataDir: await Files.createDirAsync(this.dataDir),
            stashDir: await Files.createDirAsync(this.stashDir),
            logsDir: await Files.createDirAsync(this.logsDir),
            configDir: await Files.createDirAsync(this.configDir)
        };

        return this;

    }

}

/**
 * Results of initialization:
 */
export interface Initialization {
    readonly dataDir: CreateDirResult
    readonly stashDir: CreateDirResult
    readonly logsDir: CreateDirResult
    readonly configDir: CreateDirResult
}
