import {Pipe, PipeListener, PipeNotification} from './Pipe';

export class MockPipes<E,M> {

    public readonly left: MockPipe<E,M>;
    public readonly right: MockPipe<E,M>;

    constructor(left: MockPipe<E,M>, right: MockPipe<E,M>) {
        this.left = left;
        this.right = right;
    }

    static create<E,M>(): MockPipes<E,M> {

        let left = new MockPipe<E,M>('left');
        let right = new MockPipe<E,M>('right');

        left.target=right;
        right.target=left;

        return new MockPipes<E,M>(left, right);

    }

}

export class MockPipe<E,M> extends Pipe<E,M> {

    private name: string;

    target?: MockPipe<E,M>;

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

        let notification = new PipeNotification<E,M>(channel, <E>{}, msg);

        // deliver the messages to the target now...

        this.target.onListeners.get(channel).forEach(listener => {
            listener(notification)
        });

        this.target.onceListeners.get(channel).forEach(listener => {
            listener(notification)
        });

        this.target.onceListeners.clear(channel);

    }

    on(channel: string, listener: PipeListener<E,M>) {
        this.onListeners.register(channel, listener);
    }

    once(channel: string, listener: PipeListener<E,M>) {
        this.onceListeners.register(channel, listener);
    }

    when(channel: string): Promise<PipeNotification<E,M>> {
        return new Promise<PipeNotification<E,M>>(resolve => {
            this.once(channel, notification => {
                resolve(notification);
            })
        })
    }

}

class ListenerMap<E,M> {

    private backing: { [index: string]: PipeListener<E,M>[] } = {};

    register(channel: string, listener: PipeListener<E,M>): void {

        if(! (channel in this.backing)) {
            this.backing[channel] = [];
        }

        this.backing[channel].push(listener)

    }

    get(channel: string): PipeListener<E,M>[] {

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

