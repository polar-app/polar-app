import {IPCMessage} from '../../util/IPCMessage';
import {IPCRegistry} from './IPCRegistry';
import {Logger} from '../../logger/Logger';
import {Channel} from '../channels/Channel';

const log = Logger.create();

export class IPCEngine<E, M> {

    private readonly channel: Channel<E,M>;

    private readonly channelName: string;

    private readonly ipcRegistry: IPCRegistry;


    constructor(channel: Channel<E,M>, channelName: string, ipcRegistry: IPCRegistry) {
        this.channel = channel;
        this.channelName = channelName;
        this.ipcRegistry = ipcRegistry;
    }

    start() {

        this.channel.on(this.channelName, channelNotification => {

            let ipcMessage = IPCMessage.create(channelNotification.message);

            if(this.ipcRegistry.contains(ipcMessage.type)) {

                let ipcHandler = this.ipcRegistry.get(ipcMessage.type);

                ipcHandler.handle(channelNotification);

            } else {
                log.warn("IPC handler type is not registered: " + ipcMessage.type);
            }

        });

    }

}
