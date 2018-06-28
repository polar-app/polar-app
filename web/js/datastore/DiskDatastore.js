const {Preconditions} = require("../Preconditions");
const {Datastore} = require("./Datastore.js");
const {Paths} = require("../util/Paths");

const fs = require("fs");
const util = require('util');

class DiskDatastore extends Datastore {

    constructor(dataDir) {

        // TODO: migrate this to use Directories

        super();

        if(dataDir) {
            // use a configured dataDir for testing.
            this.dataDir = dataDir;
        } else {
            this.dataDir = DiskDatastore.getDataDir();
        }

        // the path to the stash directory
        this.stashDir = Paths.create(this.dataDir, "stash");
        this.logsDir = Paths.create(this.dataDir, "logs");
        //this.cacheDir = Paths.create(this.dataDir, "cache");

        // TODO: migrate to Files

        this.readFileAsync = util.promisify(fs.readFile);
        this.writeFileAsync = util.promisify(fs.writeFile);
        this.mkdirAsync = util.promisify(fs.mkdir);
        this.accessAsync = util.promisify(fs.access);
        this.statAsync = util.promisify(fs.stat);
        this.unlinkAsync = util.promisify(fs.unlink);
        this.rmdirAsync = util.promisify(fs.rmdir);
        //this.existsAsync = fileExists;

    }

    async init() {

        return {
            dataDir: await this.createDirAsync(this.dataDir),
            stashDir: await this.createDirAsync(this.stashDir),
            logsDir: await this.createDirAsync(this.logsDir),
        };

    }

    /**
     * @Deprecated move to Files.
     */
    async createDirAsync(dir) {

        let result = {
            dir
        };

        if(await this.existsAsync(dir)) {
            result.exists = true;
        } else {
            result.created = true;
            await this.mkdirAsync(dir);
        }

        return result;

    }

    /**
     * Get the DocMeta object we currently in the datastore for this given
     * fingerprint or null if it does not exist.
     */
    async getDocMeta(fingerprint) {

        let docDir = this.dataDir + "/" + fingerprint;

        if(! await this.existsAsync(docDir)) {
            return null;
        }

        let statePath = docDir + "/state.json";

        let statePathStat = await this.statAsync(statePath);

        if( ! statePathStat.isFile() ) {
            return null;
        }

        let canAccess =
            await this.accessAsync(statePath, fs.constants.R_OK | fs.constants.W_OK)
                      .then(() => true)
                      .catch(() => false);

        if(! canAccess) {
            return null;
        }

        let buffer = await this.readFileAsync(statePath);
        return buffer.toString('utf8');

    }

    /**
     * @Deprecated move to Files.
     */
    async existsAsync(path) {

        return new Promise(function(resolve,reject) {

            this.statAsync(path)
                .then(function() {
                    resolve(true);
                })
                .catch(function(err) {
                    if(err.code === 'ENOENT') {
                        resolve(false);
                    } else {
                        // some other error
                        reject(err);
                    }
                });

        }.bind(this));

    }

    /**
     * Write the datastore to disk.
     */
    async sync(fingerprint, data) {

        Preconditions.assertTypeof(data, "data", "string");

        console.log("Performing sync of content into disk datastore.");

        let docDir = this.dataDir + "/" + fingerprint;

        let dirExists =
            await this.statAsync(docDir)
                      .then(() => true)
                      .catch(() => false)

        if ( ! dirExists) {
            // the directory for this file is missing.
            console.log(`Doc dir does not exist. Creating ${docDir}`);
            await this.mkdirAsync(docDir)
        }

        let statePath = docDir + "/state.json";

        console.log(`Writing data to state file: ${statePath}`);

        // FIXME: is this UTF-8 ??

        return await this.writeFileAsync(statePath, data);

    }

    static getUserHome() {

        let result = process.env[(process.platform === 'win32') ? 'USERPROFILE' : 'HOME'];

        if(!result) {
            result = os.homedir();
        }

        return result;
    }

    static getDataDir() {
        return DiskDatastore.getUserHome() + "/.polar";
    }

}

/**
 * A disk based datastore with long term persistence.
 */
module.exports.DiskDatastore = DiskDatastore;
