/**
 * A generic IPC request message with a type parameter.
 */
export class IPCMessage {

    public readonly type: string;

    public readonly value: any;

    /**
     * A nonce representing this unique IPC request.
     */
    public readonly nonce: number;

    constructor(type: string, value: any, nonce?: number) {
        this.type = type;
        this.value = value;

        if(! nonce) {
            this.nonce = new Date().getMilliseconds();
        }

    }

    computeResponseChannel() {
        return 'response:' + this.nonce;
    }

}
