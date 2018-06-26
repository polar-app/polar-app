const {Files} = require("../util/Files");
const {Paths} = require("../util/Paths");
const {DiskDatastore} = require("./DiskDatastore");

/**
 * Represents key local directories for Polar when running locally.
 */
class Directories {

    constructor(dataDir) {

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

module.exports.Directories = Directories;
