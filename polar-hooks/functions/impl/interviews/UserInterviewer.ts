import admin from "firebase-admin";
import UserRecord = admin.auth.UserRecord;
import {UserPager} from "./UserPager";
import {TimeDurations} from "polar-shared/src/util/TimeDurations";
import {UserInterviews} from "./UserInterviews";
import {UserInterview, UserInterviewReason} from "./UserInterview";
import {ISODateTimeStrings} from "polar-shared/src/metadata/ISODateTimeStrings";
import {UserInterviewMessages, UserMessageType} from "./UserInterviewMessages";
import {Sendgrid} from "../Sendgrid";

const NR_MESSAGES_PER_BATCH = 10;

export type UserPredicate = (user: UserRecord) => boolean;

/**
 * Predicates for accepting a user to interview.
 */
class UserPredicates {

    public static get(reason: UserInterviewReason): UserPredicate {

        switch(reason) {

            case "recent":
                return this.recent;

            case "veteran":
                return this.veteran;

            case "churned":
                return this.churned;

        }

    }

    public static recent(user: UserRecord) {

        const recentlyAuthenticated = ! TimeDurations.hasElapsed(user.metadata.lastSignInTime, '7d');
        const accountRecent = ! TimeDurations.hasElapsed(user.metadata.creationTime, '45d');

        return recentlyAuthenticated && accountRecent;
    }

    public static veteran(user: UserRecord) {

        const recentlyAuthenticated = ! TimeDurations.hasElapsed(user.metadata.lastSignInTime, '7d');
        const accountVeteran = TimeDurations.hasElapsed(user.metadata.creationTime, '60d');

        return recentlyAuthenticated && accountVeteran;

    }

    /**
     * Last logged in more than 14 days ago they have a somewhat recent account.
     */
    public static churned(user: UserRecord) {
        const notAuthenticatedRecently = TimeDurations.hasElapsed(user.metadata.lastSignInTime, '14d');
        const accountRecent = ! TimeDurations.hasElapsed(user.metadata.creationTime, '30');

        return notAuthenticatedRecently && accountRecent;
    }


}

class UsersRecentlyContacted {

    /**
     * Filter out recently contacted so we don't send them a second message.
     */
    public static async filter(users: ReadonlyArray<UserRecord>) {

        const result: UserRecord[] = [];

        for(const user of users) {

            const email = user.email!;

            const userInterview = await UserInterviews.get(email);

            if (! userInterview) {
                result.push(user);
            }

        }

        return result;

    }

    public static async write(users: ReadonlyArray<UserRecord>, reason: UserInterviewReason) {

        for(const user of users) {

            const email = user.email!;

            const userInterview: UserInterview = {
                email,
                lastAttempt: ISODateTimeStrings.create(),
                reason
            };

            await UserInterviews.write(email, userInterview);

        }

    }


}

class MessageSender {

    public static async sendMessages(type: UserMessageType, users: ReadonlyArray<UserRecord>) {

        for(const user of users) {

            const userInterviewMessage = UserInterviewMessages.compute(type, user);

            const msg = {
                from: 'burton@getpolarized.io',
                to: user.email!,
                subject: userInterviewMessage.subject,
                text: userInterviewMessage.body,
            };

            await Sendgrid.send(msg);

        }


    }

}

export class UserInterviewer {

    public static async computeTargets(maxUsers: number,
                                       predicate: UserPredicate): Promise<ReadonlyArray<UserRecord>> {

        const result: UserRecord[] = [];

        const userPager = new UserPager();

        while (await userPager.hasNext()) {

            const userRecords = await userPager.next();

            const filtered = await UsersRecentlyContacted.filter(userRecords.filter(predicate));

            result.push(...filtered);

            if (result.length >= maxUsers) {
                break;
            }

        }

        return result.slice(0, maxUsers);


    }

    private static async sendMessagesForReason(type: UserMessageType,
                                               reason: UserInterviewReason,
                                               nrMessagesPerBatch: number = NR_MESSAGES_PER_BATCH) {

        console.log("Sending messages for batch reason: " + reason);

        const predicate = UserPredicates.get(reason);
        const targets = await this.computeTargets(nrMessagesPerBatch, predicate);

        // const targetEmails = targets.map(current => current.email);

        await MessageSender.sendMessages(type, targets);

        await UsersRecentlyContacted.write(targets, reason);

    }

    public static async exec() {

        await this.sendMessagesForReason('standard', 'recent');
        await this.sendMessagesForReason('standard', 'veteran');
        await this.sendMessagesForReason('churned', 'churned', 100);

        console.log("SENT!!!")

    }

}

