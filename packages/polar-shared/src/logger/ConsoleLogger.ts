import {ILogger} from './ILogger';

/**
 * Simple logger that just writes to the console.
 */
export class ConsoleLogger implements ILogger {

    public readonly name: string = 'console-logger';

    public notice(msg: string, ...args: readonly any[]) {
        console.log(msg, ...args);
    }

    public info(msg: string, ...args: readonly any[]) {
        console.log(msg, ...args);
    }

    public warn(msg: string, ...args: readonly any[]) {
        console.warn(msg, ...args);
    }

    public error(msg: string, ...args: readonly any[]) {
        console.error(msg, ...args);
    }

    public verbose(msg: string, ...args: readonly any[]) {
        console.log(msg, ...args);
    }

    public debug(msg: string, ...args: readonly any[]) {

        // TODO: we might want to make this call console.debug and not
        // console.log so that we can turn it off but it's also nice to disable
        // these for performance reasons  so I'm not sure of the right strategy.
        console.log(msg, ...args);

    }

    public async sync(): Promise<void> {
        // noop
    }

}
