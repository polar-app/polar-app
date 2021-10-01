import {SentryReporters} from "polar-hooks-functions/impl/reporters/SentryReporter";
import {PrivateBetaReqCollection} from "polar-firebase/src/firebase/om/PrivateBetaReqCollection";
import {FirestoreAdmin} from "polar-firebase-admin/src/FirestoreAdmin";
import {Challenges} from "polar-shared/src/util/Challenges";
import {IRegisterForPrivateBetaRequest} from "polar-private-beta-api/src/IRegisterForPrivateBetaRequest";
import {
    IRegisterForPrivateBetaError,
    IRegisterForPrivateBetaResponse
} from "polar-private-beta-api/src/IRegisterForPrivateBetaResponse";

/**
 * Main function for adding users to our private beta.  Takes a user and a tag
 * as part of the request and updates the collection
 */
export namespace RegisterForPrivateBeta {

    export async function exec(request: IRegisterForPrivateBetaRequest): Promise<IRegisterForPrivateBetaResponse | IRegisterForPrivateBetaError> {

        try {

            const firestore = FirestoreAdmin.getInstance();
            const {challenge} = Challenges.create();

            await PrivateBetaReqCollection.set(firestore, {
                tags: [request.tag],
                email: request.email,
                challenge
            })

            // TODO: send them an email thanking them...
            // TODO: no metadata yet...

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
