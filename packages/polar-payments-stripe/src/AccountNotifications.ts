import {Billing} from "polar-accounts/src/Billing";
import {Sendgrid} from "polar-sendgrid/src/Sendgrid";
import {FounderPersonas, IFounderPersona} from "./FounderPersonas";
import {UserPersonas} from "polar-shared/src/util/UserPersonas";
import {AmplitudeBackendAnalytics} from "polar-amplitude-backend/src/AmplitudeBackendAnalytics";
import {IUserRecord} from 'polar-firestore-like/src/IUserRecord'
import V2Subscription = Billing.V2Subscription;
import IUserPersona = UserPersonas.IUserPersona;

export namespace AccountNotifications {

    import V2Subscription = Billing.V2Subscription;

    export async function changePlan(from: V2Subscription,
                                     to: V2Subscription,
                                     user: Pick<IUserRecord, 'uid' | 'email' | 'displayName'>) {

        if (! user.email) {
            console.warn("No user email");
            return;
        }

        const persona = FounderPersonas.random();
        const userPersona = UserPersonas.create(user);

        if (! userPersona) {
            console.warn("No userPersona");
            return;
        }

        if (from.plan.level === 'free' && to.plan.level !== 'free') {

            const subject = createSubject(to, userPersona);
            const body = createBody(to, persona, userPersona);

            await Sendgrid.send({
                to: user.email,
                bcc: persona.email,
                from: persona.email,
                subject,
                html: body
            })

            await AmplitudeBackendAnalytics.event2('AccountNotification.changePlan', {
                plan_level: to.plan.level,
                plan_interval: to.interval
            }, user);

        }

    }

}

function createSubject(sub: V2Subscription, userPersona: IUserPersona): string {
    return `Welcome to Polar ${sub.plan.level.toUpperCase()}! 🚀`;
}

function createBody(sub: V2Subscription, persona: IFounderPersona, userPersona: IUserPersona): string {
    return `<p>
Welcome to Polar ${sub.plan.level.toUpperCase()}. I'm ${persona.firstName}, one of the founders here at Polar and wanted to briefly say hi.
</p>

<p>
If you have any questions or run into any issues, let me know directly. Either by email here or in-app through Intercom. We're still at the early stages of Polar but want to provide good support. It also helps us understand how to further improve the product 😊
</p>

<p>
Cheers, ${persona.firstName}
</p>

`;

}
