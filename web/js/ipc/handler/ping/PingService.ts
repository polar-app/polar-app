import {IPCEngine} from '../IPCEngine';
import {IPCEvent} from '../IPCEvent';
import {PingHandler} from './PingHandler';

export class PingService {

    public readonly ipcEngine: IPCEngine<IPCEvent>;

    constructor(ipcEngine: IPCEngine<IPCEvent>) {
        this.ipcEngine = ipcEngine;
    }

    async start(): Promise<void> {

        this.ipcEngine.registry.registerPath('/ping', new PingHandler());
        this.ipcEngine.start();

    }

}
