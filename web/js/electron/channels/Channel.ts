
export interface Channel {

    write(channel: string, message: any): void;

    on(channel: string, listener: ChannelListener): void;

    once(channel: string, listener: ChannelListener): void;

    /**
     * Like once but uses a promise.  We return the value of the message
     */
    when(channel: string): Promise<ChannelNotification>;



}

export interface ChannelListener {
    (notification: ChannelNotification): void;
}

export class ChannelNotification {

    public readonly event: any;
    public readonly message: any;

    constructor(event: any, message: any) {
        this.event = event;
        this.message = message;
    }

}
