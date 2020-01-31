// print a report of users that would be good candiates for user interviews probably new users that have been using for
// 30 days and also aged users > 90 days but still actively using the product.

import {FirebaseAdmin} from "../../impl/util/FirebaseAdmin";
import * as admin from 'firebase-admin';
import {TimeDurations} from "polar-shared/src/util/TimeDurations";

function createEmailLink(email: string, subject: string, body: string) {

    const params = {
        subject: encodeURIComponent(subject),
        body: encodeURIComponent(body)
    };

    return `<a href=mailto:${email}?subject=${params.subject}&body=${params.body}>${email}</a>`;

}

function isRecentUser(user: admin.auth.UserRecord) {

    const recentlyAuthenticated = ! TimeDurations.hasElapsed(user.metadata.lastSignInTime, '7d');
    const accountRecent = ! TimeDurations.hasElapsed(user.metadata.creationTime, '45d');

    return recentlyAuthenticated && accountRecent;
}

function isVeteranUser(user: admin.auth.UserRecord) {

    const recentlyAuthenticated = ! TimeDurations.hasElapsed(user.metadata.lastSignInTime, '7d');
    const accountVeteran = TimeDurations.hasElapsed(user.metadata.creationTime, '60d');

    return recentlyAuthenticated && accountVeteran;

}

export type UserType = 'recent' | 'veteran';

function computeUserType(user: admin.auth.UserRecord): UserType | undefined {

    if (isRecentUser(user)) {
        return 'recent';
    }

    if (isVeteranUser(user)) {
        return 'veteran';
    }

    return undefined;

}

function computeFirstName(user: admin.auth.UserRecord) {

    const displayName = user.displayName;
    const firstName = displayName!.split(" ")[0];
    return firstName;

}

function computeMailBody(firstName: string) {

    return `Hey ${firstName},

I'm Kevin, the author of Polar..  

I need a favor! Could I interview you about how you use Polar and your use case?

It won't take more than 15 minutes.

This feedback *really* helps me prioritize important features.

My calendar link is here:

https://calendly.com/kevinburton415/polar-meeting

 and you can just pick a time directly and send you a confirmation!  I picked a 
 30 minute window in case it runs over but it's usually about 15 minutes.

... and if you don't have time don't worry about it!  We're all busy! 

Thanks!

Kevin

`;

}

function computeMailSubject(firstName: string ) {
    return`Hey ${firstName}, can I interview you about Polar?`;
}

function handleUsers(users: admin.auth.UserRecord[]) {

    for (const user of users) {

        const userType = computeUserType(user);

        if (userType) {

            const firstName = computeFirstName(user);

            const subject = computeMailSubject(firstName);
            const body = computeMailBody(firstName);

            const emailLink = createEmailLink(user.email!, subject, body)

            console.log(`HIT: ${userType}: ${user.email}: ${emailLink}`);
        }

    }

}

// FIXME: write a table of users into Firebase so I don't send duplicate invites to the same user!!!


async function exec() {

    const app = FirebaseAdmin.app();
    const auth = app.auth();

    let nextPageToken: string | undefined;

    while (true) {

        console.log("Fetching batch of users...");
        const listUsersResult = await auth.listUsers(1000, nextPageToken);
        console.log("Fetching batch of users...done");

        handleUsers(listUsersResult.users);

        if (listUsersResult.pageToken) {
            nextPageToken = listUsersResult.pageToken;
        } else {
            break;
        }

    }

}

exec()
    .catch(err => console.error(err));
