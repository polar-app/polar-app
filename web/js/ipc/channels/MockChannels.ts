import {Channel, ChannelListener, ChannelNotification} from './Channel';

export class MockChannels<E,M> {

    public readonly left: MockChannel<E,M>;
    public readonly right: MockChannel<E,M>;

    constructor(left: MockChannel<E,M>, right: MockChannel<E,M>) {
        this.left = left;
        this.right = right;
    }

    static create<E,M>(): MockChannels<E,M> {

        let left = new MockChannel<E,M>('left');
        let right = new MockChannel<E,M>('right');

        left.target=right;
        right.target=left;

        return new MockChannels<E,M>(left, right);

    }

}

export class MockChannel<E,M> extends Channel<E,M> {

    private name: string;

    target?: MockChannel<E,M>;

    constructor(name: string) {
        super();
        this.name = name;
    }

    protected onListeners: ListenerMap<E,M> = new ListenerMap();

    protected onceListeners: ListenerMap<E,M> = new ListenerMap();

    write(channel: string, msg: M): void {

        if(! this.target) {
            throw new Error("No target");
        }

        let notification = new ChannelNotification<E,M>(<E>{}, msg);

        // deliver the messages to the target now...

        this.target.onListeners.get(channel).forEach(listener => {
            listener(notification)
        });

        this.target.onceListeners.get(channel).forEach(listener => {
            listener(notification)
        });
        this.target.onceListeners.clear(channel);


    }

    on(channel: string, listener: ChannelListener<E,M>) {
        this.onListeners.register(channel, listener);
    }

    once(channel: string, listener: ChannelListener<E,M>) {
        this.onceListeners.register(channel, listener);
    }

    when(channel: string): Promise<ChannelNotification<E,M>> {
        return new Promise<ChannelNotification<E,M>>(resolve => {
            this.once(channel, notification => {
                resolve(notification);
            })
        })
    }

}

class ListenerMap<E,M> {

    private backing: { [index: string]: ChannelListener<E,M>[] } = {};

    register(channel: string, listener: ChannelListener<E,M>): void {

        if(! (channel in this.backing)) {
            this.backing[channel] = [];
        }

        this.backing[channel].push(listener)

    }

    get(channel: string): ChannelListener<E,M>[] {

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

