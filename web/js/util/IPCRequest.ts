/**
 * A generic IPC request message with a type parameter.
 */
export class IPCRequest {

    public readonly type: string;

    public readonly value: any;

    constructor(type: string, value: any) {
        this.type = type;
        this.value = value;
    }

}
