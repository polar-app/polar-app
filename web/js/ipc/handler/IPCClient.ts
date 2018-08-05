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

        // FIXME: this is the problem.. we're waiting for the response from the
        // pipe not from the sender which we don't really have a channel to I
        // think.  This would happen in ipcMain... if ipcMain is listening to a
        // pipe and a response goes to another renderer then we never get the
        // response...  but basically there's NO way for ipcMain to execute
        // this way because if it writes to a remote window... no.. the
        // response should come back because we're using the sender.  I just
        // need to test it.

        let responsePromise = this.pipe.when(ipcMessage.computeResponseChannel());

        this.pipe.write(path, ipcMessage);

        let response = await responsePromise;

        return response.message;

    }

}
