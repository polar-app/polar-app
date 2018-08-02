import {Pipe} from '../pipes/Pipe';
import {IPCMessage} from './IPCMessage';
import {IPCEvent} from './IPCEvent';

/**
 * A client which executes requests and waits for responses.
 */
export class IPCClient<E extends IPCEvent, R> {

    private readonly path: string;

    private readonly pipe: Pipe<E, IPCMessage<any>>;

    constructor(path: string, pipe: Pipe<E, IPCMessage<any>>) {
        this.path = path;
        this.pipe = pipe;
    }

    async execute(path: string, request: R): Promise<IPCMessage<any>> {

        let ipcMessage = new IPCMessage('request', request);

        let responsePromise = await this.pipe.when(ipcMessage.computeResponseChannel());

        this.pipe.write(this.path, ipcMessage);

        let response = await responsePromise;

        return response.message;

    }

}
