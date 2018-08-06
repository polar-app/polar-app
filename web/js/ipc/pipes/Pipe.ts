import {Pipes} from './Pipes';
import {WritableFunction} from '../handler/WritablePipes';

export abstract class Pipe<E,M> implements WritablePipe<M>, ReadablePipe<E, M> {

    abstract write(channel: string, message: M): void;

    abstract on(channel: string, listener: PipeListener<E,M>): void;

    abstract once(channel: string, listener: PipeListener<E,M>): void;

    when(channel: string): Promise<PipeNotification<E,M>> {
        return Pipes.when(this, channel);
    }

}

/**
 * Like a pipe but we can only write.
 */
export interface WritablePipe<M> {

    write(channel: string, message: M): void;

}

export class WritablePipeFunction<M> implements WritablePipe<M> {

    private readonly writableFunction: WritableFunction<M>

    constructor(writableFunction: WritableFunction<M>) {
        this.writableFunction = writableFunction;
    }

    write(channel: string, message: M): void {
        this.writableFunction(channel, message);
    }

}


/**
 * A read-only pipe.
 */
export interface ReadablePipe <E, M> {

    on(channel: string, listener: PipeListener<E,M>): void;

    once(channel: string, listener: PipeListener<E,M>): void;

    /**
     * Like once but uses a promise.  We return the value of the message in the
     * promise via the {PipeNotification}
     */
    when(channel: string): Promise<PipeNotification<E,M>>;

}

export interface PipeListener<E,M> {
    (notification: PipeNotification<E,M>): void;
}

export class PipeNotification<E,M> {

    // TODO: we might want to include the channel on which this was generated.

    public readonly channel: string;
    public readonly event: E;
    public readonly message: M;

    constructor(channel: string, event: E, message: M) {
        this.channel = channel;
        this.event = event;
        this.message = message;
    }

}
