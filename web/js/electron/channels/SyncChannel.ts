import {Channel} from './Channel';

/**
 * Provides a channel that syncs with the remote channel so that they are both
 *
 */
export class SyncChannel {

    private delegate: Channel;

    constructor(delegate: Channel) {
        this.delegate = delegate;

    }

    async sync(): Promise<void> {

        this.delegate.write('establish', 'sync');

        await this.delegate.when('establish');

        console.log("Got established!");

        this.delegate.write('establish', 'sync');

    }

}
