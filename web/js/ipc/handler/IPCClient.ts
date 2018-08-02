import {Pipe} from '../pipes/Pipe';
import {IPCMessage} from './IPCMessage';
import {IPCEvent} from './IPCEvent';
import {IPCPipe} from './IPCPipe';

/**
 * A client which executes requests and waits for responses.
 */
export class IPCClient<E extends IPCEvent> {

    private readonly pipe: IPCPipe<E>;

    constructor(pipe: IPCPipe<E>) {
        this.pipe = pipe;
    }

    async execute<R>(path: string, request: R): Promise<IPCMessage<any>> {

        let ipcMessage = new IPCMessage<any>('request', request);

        let responsePromise = this.pipe.when(ipcMessage.computeResponseChannel());

        this.pipe.write(path, ipcMessage);

        let response = await responsePromise;

        return response.message;

    }

}
