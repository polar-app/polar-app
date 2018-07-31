import {Channel, ChannelListener, ChannelNotification} from './Channel';

/**
 * Like a regular channel but when someone writes to us we convert types from
 * 'any' to the required type and we push it to the delegate.
 *
 */
export abstract class TypedChannel<E, M> implements Channel<E, any> {

    private readonly channel: Channel<E,any>;

    protected constructor(source: Channel<E,any>) {
        this.channel = source;
    }

    on(channel: string, listener: ChannelListener<E, M>): void {
        this.channel.on(channel, (channelNotification) => {
            listener(this.convertChannelNotification(channelNotification));
        });
    }

    once(channel: string, listener: ChannelListener<E, any>): void {
        this.channel.once(channel, (channelNotification) => {
            listener(this.convertChannelNotification(channelNotification));
        });
    }

    async when(channel: string): Promise<ChannelNotification<E, M>> {
        return this.convertChannelNotification(await this.channel.when(channel))
    }

    write(channel: string, message: M): void {
        this.channel.write(channel, message);
    }

    convertChannelNotification(channelNotification: ChannelNotification<E,any>) {
        return new ChannelNotification<E,M>(channelNotification.event, this.convert(channelNotification.message));
    }

    abstract convert(obj: any): M;

}
