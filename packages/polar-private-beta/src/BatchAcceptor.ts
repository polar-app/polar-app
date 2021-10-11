import {ComputeNextUserPriority} from "./ComputeNextUserPriority";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {FirebaseUserCreator} from "polar-firebase-admin/src/FirebaseUserCreator";
import {IDUser} from "polar-hooks-functions/impl/util/IDUsers";
import {UserPersonas} from "polar-hooks-functions/impl/personas/UserPersonas";

export namespace BatchAcceptor {
    import IUserRecord = UserPersonas.IUserRecord;

    interface IBatchAcceptorRequest {
    }

    interface IBatchAcceptorResponse {
        accepted: IUserRecord[],
    }

    /**
     * Every invocation of the cloud function will accept this number of users
     * from the top of the waiting list for Private Beta
     */
    const MAX_BATCH_SIZE = 1;

    /**
     * Define a list of users that can invoke this cloud function
     * for accepting users into the private beta
     */
    function canAcceptBatch(idUser: IDUser) {
        const allowedEmails = [
            'dzhuneyt@getpolarized.io',
            'jonathan@getpolarized.io',
        ];
        return allowedEmails.includes(idUser.user.email as string);
    }

    export const exec = async (idUser: IDUser, request: IBatchAcceptorRequest): Promise<IBatchAcceptorResponse> => {
        if (!canAcceptBatch(idUser)) {
            throw new Error('Not authorized');
        }

        const accepted: IUserRecord[] = [];

        /**
         * Retrieve a prioritized list of waiting users
         */
        const batch = await ComputeNextUserPriority.compute({
            tagPriorities: {
                initial_signup: {
                    priority: 1,
                },
            },
        });

        /**
         * Take the first N number of users from the queue
         */
        const chunk = batch.slice(0, MAX_BATCH_SIZE);

        for (let waitingUser of chunk) {
            const email = waitingUser.email;
            const password = Hashcodes.createRandomID();

            const user = await FirebaseUserCreator.create(email, password);

            accepted.push(user);
        }

        return {
            accepted,
        }
    }
}
