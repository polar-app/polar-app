import * as admin from "firebase-admin";

export class UserInterviewMessages {

    public static compute(user: admin.auth.UserRecord): UserInterviewMessage {
        const firstName = this.computeFirstName(user);
        const subject = this.computeMailSubject(firstName);
        const body = this.computeMailBody(firstName);

        return {subject, body};

    }

    private static computeFirstName(user: admin.auth.UserRecord) {

        const displayName = user.displayName;
        const firstName = displayName!.split(" ")[0];
        return firstName;

    }

    private static computeMailBody(firstName: string) {

        return `Hey ${firstName},

I'm Kevin, the author of Polar..  

I need a favor! Could I interview you about how you use Polar?

It won't take more than 15 minutes.

This feedback *really* helps me prioritize important features.

My calendar link is here:

https://calendly.com/kevinburton415/polar-meeting

... and you can just pick a time directly and send you a confirmation!  I picked a 
30 minute window in case it runs over but it's usually about 15 minutes.

If you're too busy don't worry don't worry about it.  

I created a survey you can use here:

https://kevinburton1.typeform.com/to/TkmP8x 

It's not the same but either way we I appreciate the feedback!

Thanks!

Kevin

`;

    }

    private static computeMailSubject(firstName: string ) {
        return`Hey ${firstName}, can I interview you about Polar?`;
    }


}

export interface UserInterviewMessage {
    readonly subject: string;
    readonly body: string;
}
