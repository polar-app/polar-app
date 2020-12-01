import {Billing} from "polar-accounts/src/Billing";
import {Sendgrid} from "../Sendgrid";
import Subscription = Billing.Subscription;
import {IPersona, Personas} from "../personas/Personas";
import {UserPersonas} from "../personas/UserPersonas";
import IUserPersona = UserPersonas.IUserPersona;
import V2Subscription = Billing.V2Subscription;
import {AmplitudeUtils} from "../amplitude/AmplitudeUtils";

export namespace AccountNotifications {

    import V2Subscription = Billing.V2Subscription;
    import IUserRecord = UserPersonas.IUserRecord;

    export async function changePlan(from: V2Subscription, to: V2Subscription, user: IUserRecord) {

        if (! user.email) {
            console.warn("No user email");
            return;
        }

        const persona = Personas.random();
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
                from: persona.email,
                subject,
                text: body
            })

            AmplitudeUtils.event2('AccountNotification.changePlan', {}, user);

        }

    }

}

function createSubject(sub: V2Subscription, userPersona: IUserPersona): string {
    return `Hey ${userPersona.firstName}, Thanks for Buying Polar ${sub.plan.level}!`;
}

function createBody(sub: V2Subscription, persona: IPersona, userPersona: IUserPersona): string {
    return `Hey ${userPersona.firstName}!

I'm ${persona.firstName}, one of the founders here at Polar.

We just wanted to say thanks for subscribing to Polar ${sub.plan.level}!  We really 
appreciate the support!

Thanks!

${persona.firstName}

`;

}