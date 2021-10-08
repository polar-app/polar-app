import {IRPCError} from "polar-shared/src/util/IRPCError";

// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface IRegisterForPrivateBetaResponse {

}

export interface IRegisterForPrivateBetaErrorFailed extends IRPCError<'failed'> {
    readonly message: string;
}

export type IRegisterForPrivateBetaError = IRegisterForPrivateBetaErrorFailed;
