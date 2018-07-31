import {IPCMessage} from './IPCMessage';
import {IPCRegistry} from './IPCRegistry';
import {Logger} from '../../logger/Logger';
import {Pipe, ReadablePipe} from '../channels/Pipe';

const log = Logger.create();

export class IPCEngine<E, M> {

    private readonly pipe: ReadablePipe<E,IPCMessage<M>>;

    private readonly channel: string;

    private readonly ipcRegistry: IPCRegistry<E>;

    constructor(pipe: ReadablePipe<E,IPCMessage<M>>, channel: string, ipcRegistry: IPCRegistry<E>) {
        this.pipe = pipe;
        this.channel = channel;
        this.ipcRegistry = ipcRegistry;
    }

    start() {

        this.pipe.on(this.channel, pipeNotification => {

            let ipcMessage = IPCMessage.create(pipeNotification.message);

            if(this.ipcRegistry.contains(ipcMessage.type)) {

                let ipcHandler = this.ipcRegistry.get(ipcMessage.type);

                ipcHandler.handle(pipeNotification.event, ipcMessage);

            } else {
                log.warn("IPC handler type is not registered: " + ipcMessage.type);
            }

        });

    }

}
