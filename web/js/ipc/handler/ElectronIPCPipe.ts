import {IPCPipe} from './IPCPipe';
import {PipeNotification, WritablePipes} from '../pipes/Pipe';
import {IPCMessage} from './IPCMessage';
import {ElectronIPCEvent} from './ElectronIPCEvent';

export class ElectronIPCPipe extends IPCPipe<ElectronIPCEvent> {

    convertEvent(pipeNotification: PipeNotification<any,any>): ElectronIPCEvent {

        let writablePipe =
            WritablePipes.create((channel: string, event: IPCMessage<any>) =>
                pipeNotification.event.sender.send(channel, event));

        let message = IPCMessage.create(pipeNotification.message);

        return new ElectronIPCEvent(writablePipe, message, pipeNotification.event.sender);

    }

}
