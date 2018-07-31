/**
 * Index of handler by the IPC type.
 */
import {IPCHandler} from './IPCHandler';

export class IPCRegistry {

    private backing: { [type: string]: IPCHandler<any> } = {};

    register(handler: IPCHandler<any>) {
        this.backing[handler.getType()] = handler;
    }

    get(type: string) {
        return this.backing[type];
    }

    contains(type: string) {
        return type in this.backing;
    }

}
