
class ConsoleLogger {

    info(...args) {
        console.log(...args);
    }

    warn(...args) {
        console.warn(...args);
    }

    error(...args) {
        console.error(...args);
    }

    verbose(...args) {
        console.log("VERBOSE: " , ...args);
    }

    debug(...args) {
        console.log("DEBUG: " , ...args);
    }

}

module.exports.ConsoleLogger = ConsoleLogger;
