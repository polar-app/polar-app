import * as admin from "firebase-admin";

export interface FromOpts {
    readonly email: string;
    readonly firstName: string;
    readonly calendarLink: string;
}

export interface ToOpts {
    readonly firstName: string;
}

interface MessageOpts {

    readonly from: FromOpts;
    readonly to: ToOpts;

}

export type UserMessageType = 'standard' | 'churned';

export class UserInterviewMessages {

    public static compute(type: UserMessageType,
                          user: admin.auth.UserRecord,
                          from: FromOpts) {

        switch (type) {

            case "standard":
                return this.computeStandard(user, from);
            case "churned":
                return this.computeChurned(user, from);

        }

    }

    public static computeStandard(user: admin.auth.UserRecord, from: FromOpts): UserInterviewMessage {
        return new StandardUserInterviewMessageFactory(UserMetas.create(user, from)).create();
    }

    public static computeChurned(user: admin.auth.UserRecord, from: FromOpts): UserInterviewMessage {
        return new ChurnedUserInterviewMessageFactory(UserMetas.create(user, from)).create();
    }

}

export interface UserInterviewMessageFactory {

    create(): UserInterviewMessage;

}

export class StandardUserInterviewMessageFactory implements UserInterviewMessageFactory {

    constructor(private readonly messageOpts: MessageOpts) {

    }

    public create(): UserInterviewMessage {
        const subject = this.computeMailSubject();
        const body = this.computeMailBody();
        return {subject, body};
    }

    private computeMailBody() {

        return `Hey ${this.messageOpts.to.firstName},

I'm ${this.messageOpts.from.firstName}, one of the founders of Polar..  

I need a favor! Could I interview you about how you use Polar?

It won't take more than 15 minutes.

This feedback *really* helps us prioritize important features.

My calendar link is here:

${this.messageOpts.from.calendarLink}

... and you can just pick a time directly and send you a confirmation!  

Thanks!

${this.messageOpts.from.firstName}

`;

    }

    private computeMailSubject() {
        const {firstName} = this.messageOpts.to;
        return`Hey ${firstName}, can I interview you about Polar?`;
    }

}

export class ChurnedUserInterviewMessageFactory implements UserInterviewMessageFactory {

    constructor(private readonly messageOpts: MessageOpts) {

    }

    public create(): UserInterviewMessage {
        const subject = this.computeMailSubject();
        const body = this.computeMailBody();
        return {subject, body};
    }

    private computeMailBody() {

        return `Hey ${this.messageOpts.to.firstName},

I'm ${this.messageOpts.from.firstName}, one of the founders of Polar and I need your help.  

It looks like you tried Polar but didn't continue to use the product.

Maybe we're missing a key feature you need? Maybe it was too slow?  I just don't know!

Could I get 2 minutes of your time to take a survey?

https://kevinburton1.typeform.com/to/O6RAXf

Thanks!

${this.messageOpts.from.firstName}

`;

    }

    private computeMailSubject() {
        const {firstName} = this.messageOpts.to;
        return`Hey ${firstName}, can I interview you about Polar?`;
    }

}

export interface UserInterviewMessage {
    readonly subject: string;
    readonly body: string;
}

// TODO: use UsersPersonas for this...
export interface UserMeta {
    readonly firstName: string;
}

export class UserMetas {

    public static create(user: admin.auth.UserRecord, from: FromOpts): MessageOpts {
        const firstName = this.computeFirstName(user);
        return {
            to: {firstName},
            from
        };
    }

    private static computeFirstName(user: admin.auth.UserRecord) {

        const displayName = user.displayName;
        const firstName = displayName!.split(" ")[0];
        return firstName;

    }

}
