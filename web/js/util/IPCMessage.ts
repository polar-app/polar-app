/**
 * A generic IPC request message with a type parameter.
 */
export class IPCMessage {

    public readonly type: string;

    public readonly value: any;

    /**
     * A nonce representing this unique IPC channel via a request/response pair.
     *
     * The message is unique by combining the type + nonce.
     */
    public readonly nonce: number;

    constructor(type: string, value: any, nonce: number = IPCMessage.createNonce()) {
        this.type = type;
        this.value = value;
        this.nonce = nonce;
    }

    computeResponseChannel() {
        return 'response:' + this.nonce;
    }

    private static createNonce() {
        return new Date().getMilliseconds();
    }

    static create(obj: any): IPCMessage {
        let result = Object.create(IPCMessage.prototype);
        Object.assign(result, obj);
        return result;
    }

}
