import {ILogger} from './ILogger';
import {Strings} from '../util/Strings';
import {FixedBuffer} from '../util/FixedBuffer';
import {LogMessage} from './Logging';

const capacity = Strings.toNumber(process.env.POLAR_LOG_CAPACITY, 250);

const buffer = new FixedBuffer<LogMessage>(capacity);

/**
 * Write log messages to an internal buffer for testing log output of
 * components.
 */
export class MemoryLogger implements ILogger {

    public readonly name: string = 'memory-logger';

    public notice(msg: string, ...args: any[]) {
        buffer.write({level: 'notice', msg, args});
    }

    public info(msg: string, ...args: any[]) {
        buffer.write({level: 'info', msg, args});
    }

    public warn(msg: string, ...args: any[]) {
        buffer.write({level: 'warn', msg, args});
    }

    public error(msg: string, ...args: any[]) {
        buffer.write({level: 'error', msg, args});
    }

    public verbose(msg: string, ...args: any[]) {
        buffer.write({level: 'verbose', msg, args});
    }

    public debug(msg: string, ...args: any[]) {
        buffer.write({level: 'debug', msg, args});
    }

    public getOutput(): string {
        return buffer.toView().join("\n");
    }

    public toView(): ReadonlyArray<LogMessage> {
        return buffer.toView();
    }

    public toJSON() {
        return JSON.stringify(buffer.toView(), null, "  ");
    }

    public async sync(): Promise<void> {
        // noop
    }

}

