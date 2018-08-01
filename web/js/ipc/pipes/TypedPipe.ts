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
        this.pipe.on(channel, (pipeNotification) => {
            listener(this.convertPipeNotification(pipeNotification));
        });
    }

    once(channel: string, listener: PipeListener<E, M>): void {
        this.pipe.once(channel, (pipeNotification) => {
            listener(this.convertPipeNotification(pipeNotification));
        });
    }

    async when(channel: string): Promise<PipeNotification<E, M>> {
        return this.convertPipeNotification(await this.pipe.when(channel))
    }

    convertPipeNotification(pipeNotification: PipeNotification<any,any>) {

        return new PipeNotification<E,M>(pipeNotification.channel,
                                         this.convertEvent(pipeNotification),
                                         this.convertMessage(pipeNotification.message));

    }

    abstract convertEvent(pipeNotification: PipeNotification<any,any>): E;

    abstract convertMessage(obj: any): M;

}
