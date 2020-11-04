import bodyParser from 'body-parser';
import cors from 'cors';
import * as functions from 'firebase-functions';
import {Billing} from 'polar-accounts/src/Billing';
import {StripeMode} from "./StripeUtils";
import {Preconditions} from "polar-shared/src/Preconditions";
import {StripeCreateSessions} from "./StripeCreateSessions";
import {ExpressFunctions} from "../util/ExpressFunctions";

const app = ExpressFunctions.createApp();

app.use(bodyParser.json());
app.use(cors({ origin: true }));

app.use((req, res) => {

    const stripeMode = <StripeMode> req.query.mode;
    const plan = <Billing.V2PlanLevel> req.query.plan;
    const interval = <Billing.Interval> req.query.interval;
    const email = <string> req.query.email;

    Preconditions.assertPresent(stripeMode, 'mode');
    Preconditions.assertPresent(plan, 'plan');
    Preconditions.assertPresent(interval, 'interval');
    Preconditions.assertPresent(email, 'email');

    async function doAsync() {

        try {

            const session = await StripeCreateSessions.create({stripeMode, plan, interval, email});

            res.json({id: session.id});

        } catch (err) {
            console.error(`Could not properly handle webhook: `, err);
            res.sendStatus(500);
        }

    }

    doAsync()
        .catch(err => console.log(err));

});

export const StripeCreateSessionFunction = functions.https.onRequest(app);

export interface StripeChangePlanBody {
    readonly uid: string;
    readonly email: string;
    readonly plan: Billing.Plan;
    readonly interval: Billing.Interval;
}

