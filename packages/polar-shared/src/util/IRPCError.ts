export interface IRPCError<C extends string> {
    readonly error: true;
    readonly code: C;
}
