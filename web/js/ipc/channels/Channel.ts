
export abstract class Channel<E,M> implements WritableChannel<M> {

    abstract write(channel: string, message: M): void;

    abstract on(channel: string, listener: ChannelListener<E,M>): void;

    abstract once(channel: string, listener: ChannelListener<E,M>): void;

    /**
     * Like once but uses a promise.  We return the value of the message
     */
    when(channel: string): Promise<ChannelNotification<E,M>> {
        return new Promise<ChannelNotification<E,M>>(resolve => {
            this.once(channel, notification => {
                resolve(notification);
            })
        })
    }


}

/**
 * Like a channel but we can only write.
 */
export interface WritableChannel <M> {

    write(channel: string, message: M): void;

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
