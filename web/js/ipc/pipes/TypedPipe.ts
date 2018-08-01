import {PipeListener, PipeNotification, ReadablePipe} from './Pipe';

/**
 * Like a regular channel but when someone writes to us we convert types from
 * 'any' to the required type and we push it to the delegate.
 *
 */
export abstract class TypedPipe<E, M> implements ReadablePipe<any, any> {

    private readonly pipe: ReadablePipe<any,any>;

    public constructor(source: ReadablePipe<any,any>) {
        this.pipe = source;
    }

    on(channel: string, listener: PipeListener<E, M>): void {
        this.pipe.on(channel, (channelNotification) => {
            listener(this.convertChannelNotification(channelNotification));
        });
    }

    once(channel: string, listener: PipeListener<E, M>): void {
        this.pipe.once(channel, (channelNotification) => {
            listener(this.convertChannelNotification(channelNotification));
        });
    }

    async when(channel: string): Promise<PipeNotification<E, M>> {
        return this.convertChannelNotification(await this.pipe.when(channel))
    }

    convertChannelNotification(channelNotification: PipeNotification<any,any>) {

        return new PipeNotification<E,M>(channelNotification.channel,
                                         this.convertEvent(channelNotification.event),
                                         this.convertMessage(channelNotification.message));

    }

    abstract convertEvent(obj: any): E;

    abstract convertMessage(obj: any): M;

}
