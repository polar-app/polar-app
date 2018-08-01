import {IPCMessage} from './IPCMessage';
import {IPCRegistry} from './IPCRegistry';
import {Logger} from '../../logger/Logger';
import {IPCPipe} from './IPCPipe';

const log = Logger.create();

export class IPCEngine<E, M> {

    private readonly pipe: IPCPipe<E>;

    public readonly ipcRegistry: IPCRegistry;

    constructor(pipe: IPCPipe<E>, ipcRegistry: IPCRegistry) {
        this.pipe = pipe;
        this.ipcRegistry = ipcRegistry;
    }

    start() {

        this.ipcRegistry.entries().forEach(ipcRegistration => {

            this.pipe.on(ipcRegistration.path, pipeNotification => {

                let ipcMessage = IPCMessage.create(pipeNotification.message);

                ipcRegistration.handler.handle(pipeNotification.event, ipcMessage);

            });

        })

    }

}
