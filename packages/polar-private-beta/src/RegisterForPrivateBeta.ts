import {SentryReporters} from "polar-hooks-functions/impl/reporters/SentryReporter";
import {IRPCError} from "polar-shared/src/util/IRPCError";
import {PrivateBetaReqCollection} from "polar-firebase/src/firebase/om/PrivateBetaReqCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {Challenges} from "polar-shared/src/util/Challenges";

export namespace RegisterForPrivateBeta {

    export interface IRegisterForPrivateBetaRequest {
        readonly email: string;
        readonly tag: string;
    }

    // eslint-disable-next-line @typescript-eslint/no-empty-interface
    export interface IRegisterForPrivateBetaResponse {

    }

    export interface IRegisterForPrivateBetaErrorFailed extends IRPCError<'failed'> {
        readonly message: string;
    }

    export type IRegisterForPrivateBetaError = IRegisterForPrivateBetaErrorFailed;

    export async function exec(request: IRegisterForPrivateBetaRequest): Promise<IRegisterForPrivateBetaResponse | IRegisterForPrivateBetaError> {

        try {

            const firestore = FirestoreAdmin.getInstance();
            const {challenge} = Challenges.create();

            await PrivateBetaReqCollection.set(firestore, {
                tags: [request.tag],
                email: request.email,
                challenge
            })

            return {};

        } catch (e) {
            SentryReporters.reportError("Failed to execute: ", e);
            return {
                error: true,
                code: 'failed',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                message: (e as any).message || undefined
            };
        }

    }


}
