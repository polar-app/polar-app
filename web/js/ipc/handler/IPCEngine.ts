import {IPCMessage} from './IPCMessage';
import {IPCRegistry} from './IPCRegistry';
import {Logger} from '../../logger/Logger';
import {IPCPipe} from './IPCPipe';
import {IPCError} from './IPCError';
import {IPCEvent} from './IPCEvent';

const log = Logger.create();

export class IPCEngine<E extends IPCEvent, M> {

    private readonly pipe: IPCPipe<E>;

    public readonly registry: IPCRegistry;

    constructor(pipe: IPCPipe<E>, registry: IPCRegistry) {
        this.pipe = pipe;
        this.registry = registry;
    }

    start() {

        this.registry.entries().forEach(ipcRegistration => {

            this.pipe.on(ipcRegistration.path, pipeNotification => {

                (async () => {

                    let event = pipeNotification.event;

                    let ipcMessage = IPCMessage.create(pipeNotification.message);

                    let ipcResponse: IPCMessage<any>;

                    try {

                        let result =  await ipcRegistration.handler.handle(event, ipcMessage);

                        if( ! result) {
                            // we don't have a result given to us from the handler
                            // we just return true in this situation.
                            result = true;
                        }

                        ipcResponse = new IPCMessage('result', result);

                    } catch(err) {

                        // catch any exceptions so that handlers don't have to be
                        // responsible for error handling by default.

                        ipcResponse = IPCMessage.createError('error', new IPCError(err));

                    }

                    event.responsePipe.write(ipcMessage.computeResponseChannel(), ipcResponse);

                })().catch(err => log.error(`Unable to handle IPC at ${ipcRegistration.path}: `, err));

            });

        })

    }

}
