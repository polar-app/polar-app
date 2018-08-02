import {IPCMessage} from './IPCMessage';
import {IPCRegistry} from './IPCRegistry';
import {Logger} from '../../logger/Logger';
import {IPCPipe} from './IPCPipe';
import {IPCError} from './IPCError';
import {IPCEvent} from './IPCEvent';

const log = Logger.create();

export class IPCEngine<E extends IPCEvent, M> {

    private readonly pipe: IPCPipe<E>;

    public readonly ipcRegistry: IPCRegistry;

    constructor(pipe: IPCPipe<E>, ipcRegistry: IPCRegistry) {
        this.pipe = pipe;
        this.ipcRegistry = ipcRegistry;
    }

    start() {

        this.ipcRegistry.entries().forEach(ipcRegistration => {

            this.pipe.on(ipcRegistration.path, pipeNotification => {

                let event = pipeNotification.event;

                let ipcMessage = IPCMessage.create(pipeNotification.message);

                try {

                    let result = ipcRegistration.handler.handle(event, ipcMessage);

                    event.writeablePipe.write(ipcMessage.computeResponseChannel(), result);

                } catch(err) {

                    // catch any exceptions so that handlers don't have to be
                    // responsible for error handling by default.

                    let errMessage = IPCMessage.createError('error', new IPCError(err));

                    event.writeablePipe.write(ipcMessage.computeResponseChannel(), errMessage);

                }

            });

        })

    }

}
