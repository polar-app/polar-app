import {IPCHandler} from './IPCHandler';

/**
 * Represents the metadata around a handler registration including path and
 * other future metadata we wish to add.
 */
export class IPCRegistration {

    public readonly path: string;

    public readonly handler: IPCHandler<any>;

    constructor(path: string, handler: IPCHandler<any>) {
        this.path = path;
        this.handler = handler;
    }

}
