import {IPCMessage} from './IPCMessage';
import {IPCEvent} from './IPCEvent';
import {IPCPipe} from './IPCPipe';
import {ElectronContext, ElectronMainContext} from './ElectronContext';
import {WritablePipes} from './WritablePipes';

/**
 * A client which executes requests and waits for responses.
 */
export class IPCClient<E extends IPCEvent> {

    private readonly pipe: IPCPipe<E>;

    private readonly targetContext: ElectronContext;

    constructor(pipe: IPCPipe<E>, targetContext: ElectronContext = new ElectronMainContext()) {
        this.pipe = pipe;
        this.targetContext = targetContext;
    }

    /**
     *
     * @param path The path URI to execute the request against.
     *
     * @param request The request object that is serialized and executed.
     *
     * @param targetContext The target where we should execute the request.  By
     * default, the only target we support is main -> renderer which assumes you
     * are calling from the renderer.  No other context can be inferred by
     * default.
     */
    async execute<R>(path: string, request: R, targetContext: ElectronContext = this.targetContext): Promise<IPCMessage<any>> {

        let ipcMessage = new IPCMessage<any>('request', request);

        let responsePromise = this.pipe.when(ipcMessage.computeResponseChannel());

        let writablePipe = WritablePipes.createFromContext(targetContext);

        writablePipe.write(path, ipcMessage);
        //this.pipe.write(path, ipcMessage);

        let response = await responsePromise;

        return response.message;

    }

}
