import * as admin from "firebase-admin";

export type UserMessageType = 'standard' | 'churned';

export class UserInterviewMessages {

    public static compute(type: UserMessageType, user: admin.auth.UserRecord) {

        switch(type) {

            case "standard":
                return this.computeStandard(user);
            case "churned":
                return this.computeChurned(user);

        }

    }

    public static computeStandard(user: admin.auth.UserRecord): UserInterviewMessage {
        return new StandardUserInterviewMessageFactory(UserMetas.create(user)).create();
    }

    public static computeChurned(user: admin.auth.UserRecord): UserInterviewMessage {
        return new ChurnedUserInterviewMessageFactory(UserMetas.create(user)).create();
    }

}

export interface UserInterviewMessageFactory {

    create(): UserInterviewMessage;

}

export class StandardUserInterviewMessageFactory implements UserInterviewMessageFactory {

    constructor(private readonly userMeta: UserMeta) {

    }

    public create(): UserInterviewMessage {
        const subject = this.computeMailSubject();
        const body = this.computeMailBody();
        return {subject, body};
    }

    private computeMailBody() {

        const {firstName} = this.userMeta;

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

    private computeMailSubject() {
        const {firstName} = this.userMeta;
        return`Hey ${firstName}, can I interview you about Polar?`;
    }

}

export class ChurnedUserInterviewMessageFactory implements UserInterviewMessageFactory {

    constructor(private readonly userMeta: UserMeta) {

    }

    public create(): UserInterviewMessage {
        const subject = this.computeMailSubject();
        const body = this.computeMailBody();
        return {subject, body};
    }

    private computeMailBody() {

        const {firstName} = this.userMeta;

        return `Hey ${firstName},

I'm Kevin, the author of Polar and I need your help.  

It looks like you tried Polar but didn't continue to use the product.

Maybe we're missing a key feature you need? Maybe it was too slow?  I just don't know!

Could I get 2 minutes of your time to take a survey?

https://kevinburton1.typeform.com/to/O6RAXf

Thanks!

Kevin

`;

    }

    private computeMailSubject() {
        const {firstName} = this.userMeta;
        return`Hey ${firstName}, can I interview you about Polar?`;
    }

}

export interface UserInterviewMessage {
    readonly subject: string;
    readonly body: string;
}

export interface UserMeta {
    readonly firstName: string;
}

export class UserMetas {

    public static create(user: admin.auth.UserRecord) {
        const firstName = this.computeFirstName(user);
        return {firstName};
    }

    private static computeFirstName(user: admin.auth.UserRecord) {

        const displayName = user.displayName;
        const firstName = displayName!.split(" ")[0];
        return firstName;

    }

}
