

export abstract class Pipe<E,M> implements WritablePipe<M>, ReadablePipe<E, M> {

    abstract write(channel: string, message: M): void;

    abstract on(channel: string, listener: PipeListener<E,M>): void;

    abstract once(channel: string, listener: PipeListener<E,M>): void;

    when(channel: string): Promise<PipeNotification<E,M>> {
        return when(this, channel);
    }

}

export function when<E,M>(pipe: ReadablePipe<E,M>, channel: string) {

    return new Promise<PipeNotification<E,M>>(resolve => {
        pipe.once(channel, notification => {
            resolve(notification);
        });
    });

}

/**
 * Like a pipe but we can only write.
 */
export interface WritablePipe <M> {

    write(channel: string, message: M): void;

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

    public readonly event: E;
    public readonly message: M;

    constructor(event: E, message: M) {
        this.event = event;
        this.message = message;
    }

}
