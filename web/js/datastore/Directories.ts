/**
 * Represents key local directories for Polar when running locally.
 */
import {DiskDatastore} from './DiskDatastore';
import {Paths} from '../util/Paths';
import {Files} from '../util/Files';

export class Directories {

    public readonly dataDir: string;
    public readonly stashDir: string;
    public readonly logsDir: string;

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

    }

    async init() {

        return {
            dataDir: await Files.createDirAsync(this.dataDir),
            stashDir: await Files.createDirAsync(this.stashDir),
            logsDir: await Files.createDirAsync(this.logsDir)
        };

    }

}
