import {ILogger} from './ILogger';

/**
 * Write log messages to an internal buffer for testing log output of components.
 */
export class MemoryLogger implements ILogger {

    public readonly name: string = 'memory-logger';

    public readonly buffer: Array<{}> = [];

    public notice(msg: string, ...args: any[]) {
        this.buffer.push({level: 'notice', msg, args});
    }

    public info(msg: string, ...args: any[]) {
        this.buffer.push({level: 'info', msg, args});
    }

    public warn(msg: string, ...args: any[]) {
        this.buffer.push({level: 'warn', msg, args});
    }

    public error(msg: string, ...args: any[]) {
        this.buffer.push({level: 'error', msg, args});
    }

    public verbose(msg: string, ...args: any[]) {
        this.buffer.push({level: 'verbose', msg, args});
    }

    public debug(msg: string, ...args: any[]) {
        this.buffer.push({level: 'debug', msg, args});
    }

    public getOutput(): string {
        return this.buffer.join("\n");
    }

    public toJSON() {
        return JSON.stringify(this.buffer, null, "  ");
    }

    public async sync(): Promise<void> {
        // noop
    }


}
