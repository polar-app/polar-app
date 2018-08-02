/**
 * Represents the fact that an IPC error failed.
 */
export class IPCError {

    public readonly msg: string;

    constructor(msg: string) {
        this.msg = msg;
    }

    public static create(obj: any): IPCError {

        let result: IPCError = Object.create(IPCError.prototype);
        Object.assign(result, obj);

        return result;

    }

}
