import {ComputeNextUserPriority} from "./ComputeNextUserPriority";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {FirebaseUserCreator} from "polar-firebase-users/src/FirebaseUserCreator";
import {UserPersonas} from "polar-hooks-functions/impl/personas/UserPersonas";
import {Sendgrid} from "polar-sendgrid/src/Sendgrid";
import {IDUser} from "polar-rpc/src/IDUser";

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

    async function sendWelcomeEmail(email: string) {
        const message = {
            to: email,
            from: 'noreply@getpolarized.io',
            subject: `Your Polar account has been set up. Welcome!`,
            html: `<p>You can now begin using Polar:</p>
                   <p><b><a href="https://getpolarized.io">Login to Polar</a></b></p>
                   <p style="font-size: smaller; color: #c6c6c6;">Polar - Read. Learn. Never Forget.</p>`
        };
        await Sendgrid.send(message);
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

            await sendWelcomeEmail(email);

            accepted.push(user);
        }

        return {
            accepted,
        }
    }
}
