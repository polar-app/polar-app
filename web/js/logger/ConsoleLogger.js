
class ConsoleLogger {

    info(...args) {
        console.log(...args);
    }

    warn(...args) {
        console.warn(...args);
    }

    debug(...args) {
        console.debug(...args);
    }

    error(...args) {
        console.error(...args);
    }

    debug(...args) {
        console.log("DEBUG: " , ...args);
    }

}

module.exports.ConsoleLogger = ConsoleLogger;
