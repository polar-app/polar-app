
export interface Channel<E,M> {

    write(channel: string, message: M): void;

    on(channel: string, listener: ChannelListener<E,M>): void;

    once(channel: string, listener: ChannelListener<E,M>): void;

    /**
     * Like once but uses a promise.  We return the value of the message
     */
    when(channel: string): Promise<ChannelNotification<E,M>>;

}

export interface ChannelListener<E,M> {
    (notification: ChannelNotification<E,M>): void;
}

export class ChannelNotification<E,M> {

    public readonly event: E;
    public readonly message: M;

    constructor(event: E, message: M) {
        this.event = event;
        this.message = message;
    }

}
