import {Channel, ChannelListener, ChannelNotification} from './Channel';
import {not} from 'rxjs/internal-compatibility';

export class MockChannels {

    public readonly left: MockChannel;
    public readonly right: MockChannel;

    constructor(left: MockChannel, right: MockChannel) {
        this.left = left;
        this.right = right;
    }

    static create(): MockChannels {

        let left = new MockChannel('left');
        let right = new MockChannel('right');

        left.target=right;
        right.target=left;

        return new MockChannels(left, right);

    }

}

class MockChannel implements Channel {

    private name: string;

    target?: MockChannel;

    constructor(name: string) {
        this.name = name;
    }

    protected onListeners: ListenerMap = new ListenerMap();

    protected onceListeners: ListenerMap = new ListenerMap();

    write(channel: string, msg: any): void {

        if(! this.target) {
            throw new Error("No target");
        }

        let notification = new ChannelNotification({}, msg);

        // deliver the messages to the target now...

        this.target.onListeners.get(channel).forEach(listener => {
            listener(notification)
        });

        this.target.onceListeners.get(channel).forEach(listener => {
            listener(notification)
        });
        this.target.onceListeners.clear(channel);


    }

    on(channel: string, listener: ChannelListener) {
        this.onListeners.register(channel, listener);
    }

    once(channel: string, listener: ChannelListener) {
        this.onceListeners.register(channel, listener);
    }

    when(channel: string): Promise<ChannelNotification> {
        return new Promise<ChannelNotification>(resolve => {
            this.once(channel, notification => {
                resolve(notification);
            })
        })
    }

}

class ListenerMap {

    private backing: { [index: string]: ChannelListener[] } = {};

    register(channel: string, listener: ChannelListener): void {

        if(! (channel in this.backing)) {
            this.backing[channel] = [];
        }

        this.backing[channel].push(listener)

    }

    get(channel: string): ChannelListener[] {

        let result = this.backing[channel];

        if (result) {
            return result;
        } else {
            return [];
        }

    }

    clear(channel: string) {
        delete this.backing[channel];
    }

}

