import {IPCPipe} from './IPCPipe';
import {Pipe, PipeNotification, WritablePipes} from '../pipes/Pipe';
import {IPCMessage} from './IPCMessage';
import {ElectronIPCEvent} from './ElectronIPCEvent';

export class ElectronIPCPipe extends IPCPipe<ElectronIPCEvent> {

    constructor(source: Pipe<Electron.Event, any>) {
        super(source);
    }

    convertEvent(pipeNotification: PipeNotification<Electron.Event, any>): ElectronIPCEvent {

        let writablePipe =
            WritablePipes.create((channel: string, event: IPCMessage<any>) =>
                pipeNotification.event.sender.send(channel, event));

        let message = IPCMessage.create(pipeNotification.message);

        return new ElectronIPCEvent(writablePipe, message, pipeNotification.event.sender);

    }

}
