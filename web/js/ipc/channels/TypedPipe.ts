import {Pipe, PipeListener, PipeNotification} from './Pipe';

/**
 * Like a regular channel but when someone writes to us we convert types from
 * 'any' to the required type and we push it to the delegate.
 *
 */
export abstract class TypedPipe<E, M> implements Pipe<E, any> {

    private readonly channel: Pipe<E,any>;

    protected constructor(source: Pipe<E,any>) {
        this.channel = source;
    }

    on(channel: string, listener: PipeListener<E, M>): void {
        this.channel.on(channel, (channelNotification) => {
            listener(this.convertChannelNotification(channelNotification));
        });
    }

    once(channel: string, listener: PipeListener<E, any>): void {
        this.channel.once(channel, (channelNotification) => {
            listener(this.convertChannelNotification(channelNotification));
        });
    }

    async when(channel: string): Promise<PipeNotification<E, M>> {
        return this.convertChannelNotification(await this.channel.when(channel))
    }

    write(channel: string, message: M): void {
        this.channel.write(channel, message);
    }

    convertChannelNotification(channelNotification: PipeNotification<E,any>) {
        return new PipeNotification<E,M>(channelNotification.event, this.convert(channelNotification.message));
    }

    abstract convert(obj: any): M;

}
