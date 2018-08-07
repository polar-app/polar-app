/**
 * Index of handler by the IPC type.
 */
import {IPCRegistration} from './IPCRegistration';
import {IPCHandler} from './IPCHandler';

export class IPCRegistry {

    private _backing: { [path: string]: IPCRegistration } = {};

    private _entries: IPCRegistration[] = [];

    register(registration: IPCRegistration): void {
        this._backing[registration.path] = registration;
        this._entries.push(registration);
    }

    registerPath(path: string, handler: IPCHandler<any>): void {
        this.register(new IPCRegistration(path, handler));
    }

    get(path: string): IPCRegistration {
        return this._backing[path];
    }

    contains(path: string): boolean {
        return path in this._backing;
    }

    entries(): IPCRegistration[] {
        return this._entries;
    }

}


