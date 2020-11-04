import bodyParser from 'body-parser';
import cors from 'cors';
import * as functions from 'firebase-functions';
import {Billing} from 'polar-accounts/src/Billing';
import { StripeMode } from './StripeUtils';
import {StripeChangePlans} from "./StripeChangePlans";
import {ExpressFunctions} from "../util/ExpressFunctions";

const app = ExpressFunctions.createApp();

app.use(bodyParser.json());
app.use(cors({ origin: true }));

app.use((req, res) => {

    // TODO: I think we need to validate the logged in user here.

    const handleRequest = async () => {

        try {

            console.log(JSON.stringify(req.body, null, '  '));

            const body: StripeChangePlanBody = req.body;

            await StripeChangePlans.changePlans({...body, stripeMode: body.mode});

            res.sendStatus(200);

        } catch (err) {
            const now = Date.now();
            console.error(`Could not properly handle webhook: ${now}`, err);
            console.error(`JSON body for failed webhook: ${now}`, JSON.stringify(req.body, null,  '  '));
            res.sendStatus(500);
        }

    };

    handleRequest()
        .catch(err => console.error("Failed to handle request: ", err));

});

export const StripeChangePlanFunction = functions.https.onRequest(app);

export interface StripeChangePlanBody {
    readonly uid: string;
    readonly email: string;
    readonly plan: Billing.PlanLike;
    readonly interval: Billing.Interval;
    readonly mode: StripeMode;
}

