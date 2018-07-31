/**
 * A generic IPC request message with a type parameter.
 */
import {Optional} from './ts/Optional';

export class IPCMessage<T> {

    public readonly type: string;

    public readonly value: T;

    /**
     * A nonce representing this unique IPC channel via a request/response pair.
     *
     * The message is unique by combining the type + nonce.
     */
    public readonly nonce: number;

    constructor(type: string, value: T, nonce: number = IPCMessage.createNonce()) {
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

    static create<T>(obj: any, valueFactory?: ValueFactory<T> ): IPCMessage<T> {

        // require the value.
        obj.value = Optional.of(obj.value, "value").get();

        if(valueFactory) {
            obj.value = valueFactory(obj.value);
        }

        let result: IPCMessage<T> = Object.create(IPCMessage.prototype);
        Object.assign(result, obj);

        return result;

    }

}

interface ValueFactory<T> {

    (obj: any): T;

}
