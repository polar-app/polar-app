import {Channel, ChannelListener, ChannelNotification} from './Channel';

/**
 * Provides a channel that syncs with the remote channel so that they are both
 *
 */
export class SyncChannel {

    private delegate: Channel<any,string>;

    public constructor(delegate: Channel<any,string>) {
        this.delegate = delegate;
    }

    async sync(): Promise<void> {

        // must use the create-then-await pattern or else there may be a chance
        // we miss the response notification event if we're the second waiter.
        let establishPromise = this.delegate.when('establish');

        this.delegate.write('establish', 'sync');

        await establishPromise;

        this.delegate.write('establish', 'sync');

    }
    //
    // on(channel: string, listener: ChannelListener<any,string>): void {
    //     this.delegate.on(channel, listener);
    // }
    //
    // once(channel: string, listener: ChannelListener<any,string>): void {
    //     this.delegate.once(channel, listener);
    // }
    //
    // when(channel: string): Promise<ChannelNotification<any,string>> {
    //     return this.delegate.when(channel);
    // }
    //
    // write(channel: string, message: any): void {
    //     this.delegate.write(channel, message)
    // }

}
