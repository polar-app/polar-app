import {IPCPipe} from './IPCPipe';
import {WritablePipes} from '../pipes/Pipe';
import {IPCMessage} from './IPCMessage';
import {ElectronIPCEvent} from './ElectronIPCEvent';

export class ElectronIPCPipe extends IPCPipe<ElectronIPCEvent> {

    convertEvent(evt: Electron.Event): ElectronIPCEvent {

        let writablePipe =
            WritablePipes.create((channel: string, event: IPCMessage<any>) =>
                evt.sender.send(channel, event));

        return new ElectronIPCEvent(writablePipe, evt.sender);
    }

}
