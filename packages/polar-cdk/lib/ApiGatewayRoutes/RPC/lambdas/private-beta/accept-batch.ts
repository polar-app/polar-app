import {lambdaWrapper} from "../../../../shared/lambdaWrapper";
import {IDUser} from "polar-hooks-functions/impl/util/IDUsers";
import {ComputeNextUserPriority} from "polar-private-beta/src/ComputeNextUserPriority";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {createUser} from "polar-firebase/src/auth/createUser";

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

/**
 * Every invocation of the cloud function will accept this number of users
 * from the top of the waiting list for Private Beta
 */
const MAX_BATCH_SIZE = 1;

export const handler = lambdaWrapper<unknown, unknown>(async (idUser, request) => {
    if (!canAcceptBatch(idUser)) {
        throw new Error('Not authorized');
    }

    const accepted = [];

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

        const user = await createUser(email, password);

        accepted.push(user);
    }

    return {
        accepted,
    }
});
