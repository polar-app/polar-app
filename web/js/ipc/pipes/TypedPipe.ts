import {
    Pipe,
    PipeListener,
    PipeNotification,
    ReadablePipe,
    WritablePipe
} from './Pipe';

/**
 * Like a regular channel but when someone writes to us we convert types from
 * 'any' to the required type and we push it to the delegate.
 *
 */
export abstract class TypedPipe<E, M> implements ReadablePipe<E, M>, WritablePipe<M> {

    protected readonly pipe: Pipe<any,any>;

    public constructor(source: Pipe<any,any>) {
        this.pipe = source;
    }

    public on(channel: string, listener: PipeListener<E, M>): void {
        this.pipe.on(channel, (pipeNotification) => {
            listener(this.convertPipeNotification(pipeNotification));
        });
    }

    public once(channel: string, listener: PipeListener<E, M>): void {
        this.pipe.once(channel, (pipeNotification) => {
            listener(this.convertPipeNotification(pipeNotification));
        });
    }

    public async when(channel: string): Promise<PipeNotification<E, M>> {
        return this.convertPipeNotification(await this.pipe.when(channel))
    }

    public write(channel: string, message: M): void {
        this.pipe.write(channel, message);
    }

    protected convertPipeNotification(pipeNotification: PipeNotification<any,any>) {

        return new PipeNotification<E,M>(pipeNotification.channel,
                                         this.convertEvent(pipeNotification),
                                         this.convertMessage(pipeNotification.message));

    }

    protected abstract convertEvent(pipeNotification: PipeNotification<any,any>): E;

    protected abstract convertMessage(obj: any): M;

}
