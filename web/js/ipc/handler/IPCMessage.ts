/**
 * A generic IPC request message with a type parameter.
 */
import {Optional} from '../../util/ts/Optional';
import {IPCError} from './IPCError';

export class IPCMessage<T> {

    private readonly _type: string;

    private readonly _value?: T ;

    /**
     * A nonce representing this unique IPC channel via a request/response pair.
     *
     * The message is unique by combining the type + nonce.
     */
    private readonly _nonce: number;

    private readonly _error?: IPCError;

    constructor(type: string, value?: T, nonce: number = IPCMessage.createNonce(), error?: IPCError) {
        this._type = type;
        this._value = value;
        this._nonce = nonce;
        this._error = error;
    }

    get type(): string {
        return this._type;
    }

    get value(): T {

        if(this._error) {
            throw new Error(this._error.msg);
        }

        if(! this._value) {
            // technically this should never happen.
            throw new Error("Value was undefined and no error defined.");
        }

        return this._value;
    }

    get nonce(): number {
        return this._nonce;
    }

    get error(): IPCError | undefined {
        return this._error;
    }

    computeResponseChannel() {
        return '/ipc/response:' + this.nonce;
    }

    private static createNonce() {
        return new Date().getMilliseconds();
    }

    static createError<T>(type: string, error: IPCError): IPCMessage<T> {
        return new IPCMessage<T>(type, undefined, IPCMessage.createNonce(), error);
    }

    static create<T>(obj: any, valueFactory?: ValueFactory<T> ): IPCMessage<T> {

        // require the value.
        obj._value = Optional.of(obj._value, "value").get();

        if(valueFactory) {
            obj._value = valueFactory(obj._value);
        }

        let result: IPCMessage<T> = Object.create(IPCMessage.prototype);
        Object.assign(result, obj);

        return result;

    }

}

interface ValueFactory<T> {

    (obj: any): T;

}
