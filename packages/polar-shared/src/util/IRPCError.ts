export interface IRPCError<C extends string> {
    readonly error: true;
    readonly code: C;
}

export function isRPCError(value: any): value is IRPCError<any> {
    return (typeof value.error === 'boolean') && (value.error === true);
}
