import {ipcRenderer} from 'electron';
import {IPCPipe} from './IPCPipe';
import {Pipe, PipeNotification} from '../pipes/Pipe';
import {IPCMessage} from './IPCMessage';
import {ElectronIPCEvent} from './ElectronIPCEvent';
import {ElectronContextType, ElectronRendererContext} from './ElectronContext';
import {ElectronContexts} from './ElectronContexts';
import {WritablePipes} from './WritablePipes';

export class ElectronIPCPipe extends IPCPipe<ElectronIPCEvent> {

    constructor(source: Pipe<Electron.Event, any>) {
        super(source);
    }

    convertEvent(pipeNotification: PipeNotification<Electron.Event, any>): ElectronIPCEvent {

        let request = IPCMessage.create(pipeNotification.message);

        let responsePipe =
            WritablePipes.createFromFunction((channel: string, message: IPCMessage<any>) => {

                // TODO migrate this to use: WritablePipes.createFromContext

                // create a response pipe based on the context of the request.

                let electronContext = ElectronContexts.create();

                if( electronContext.type === ElectronContextType.RENDERER &&
                    request.context.type === ElectronContextType.RENDERER ) {

                    // when we are operating between two renderers we need to
                    // send directly via ipcRenderer as Electron is broken and
                    // sends the messages from its own ipcRenderer so we end up
                    // sending to the main process.

                    let target = <ElectronRendererContext>request.context;

                    ipcRenderer.sendTo(target.windowReference.id, channel, message);

                } else {

                    // send the normal way from the main because it will properly
                    // go back to the renderer that originated it.
                    pipeNotification.event.sender.send(channel, message);
                }

            });

        let message = IPCMessage.create(pipeNotification.message);

        return new ElectronIPCEvent(responsePipe, message, pipeNotification.event.sender);

    }

}
