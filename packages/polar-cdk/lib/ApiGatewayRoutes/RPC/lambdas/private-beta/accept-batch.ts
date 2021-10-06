import {lambdaWrapper} from "../../../../shared/lambdaWrapper";
import {IDUser} from "polar-hooks-functions/impl/util/IDUsers";
import {ComputeNextUserPriority} from "polar-private-beta/src/ComputeNextUserPriority";

function canAcceptBatch(idUser: IDUser) {
    const allowedEmails = [
        'dzhuneyt@getpolarized.io',
        'jonathan@getpolarized.io',
    ];
    return allowedEmails.includes(idUser.user.email as string);
}

export const handler = lambdaWrapper<unknown, unknown>(async (idUser, request) => {
    if (!canAcceptBatch(idUser)) {
        throw new Error('Not authorized');
    }

    const batch = await ComputeNextUserPriority.compute({
        tagPriorities: {
            initial_signup: {
                priority: 1,
            },
        },
    });

    return {
        batch,
    }
});
