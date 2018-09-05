import {ILogger} from './ILogger';

/**
 * Write log messages to an internal buffer for testing log output of components.
 */
export class MemoryLogger implements ILogger {

    readonly name: string = 'memory-logger';

    public readonly buffer: {}[] = [];

    info(msg: string, ...args: any[]) {
        this.buffer.push({level: 'info', msg, args});
    }

    warn(msg: string, ...args: any[]) {
        this.buffer.push({level: 'warn', msg, args});
    }

    error(msg: string, ...args: any[]) {
        this.buffer.push({level: 'error', msg, args});
    }

    verbose(msg: string, ...args: any[]) {
        this.buffer.push({level: 'verbose', msg, args});
    }

    debug(msg: string, ...args: any[]) {
        this.buffer.push({level: 'debug', msg, args});
    }

    getOutput(): string {
        return this.buffer.join("\n");
    }

    toJSON() {
        return JSON.stringify(this.buffer, null, "  ");
    }

}
