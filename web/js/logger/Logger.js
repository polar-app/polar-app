// Simple logger that meets the requirements we have for Polar.

const log = require('electron-log');
const {Files} = require("../util/Files.js");
const {Objects} = require("../util/Objects.js");

let initialized = false;

class Logger {

    /**
     * Create a new logger, delegating to the actual implementation we are
     * using.
     */
    static create() {

        // TODO: include the source of the log but I think to do this we have to
        // either change the log() function or we have to implement a custom
        // formatter.
        //
        if(process.type !== "renderer") {

            //return log;
            return new class {

                info() {
                }

                warn() {
                }

                debug() {
                }

                error() {
                }

            }

        } else {
            return log;
        }

    }

    static async init(logsDir, options) {

        if(initialized) {
            throw new Error("Already initialized");
        }

        if(! process) {
            throw new Error("No process");
        }

        if(process.type === "renderer") {
            throw new Error(`Must initialize from the main electron process (process=${process.type})`);
        }

        options = Objects.defaults(options, {createDir: true});

        if(options.createDir) {
            await Files.createDirAsync(logsDir);
        }

        // *** configure console
        log.transports.console.level = "info";
        log.transports.console.format="[{y}-{m}-{d} {h}:{i}:{s}.{ms} {z}] [{level}] {text}";

        // *** configure file

        // set the directory name properly
        log.transports.file.file = `${logsDir}/polar.log`;
        log.transports.file.format="[{y}-{m}-{d} {h}:{i}:{s}.{ms} {z}] [{level}] {text}";

        log.transports.file.level = "info";
        log.transports.file.appName = "polar";

        initialized = true;

    }

}

module.exports.create = Logger.create;
module.exports.Logger = Logger;
