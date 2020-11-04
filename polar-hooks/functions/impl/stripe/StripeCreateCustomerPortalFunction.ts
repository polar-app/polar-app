import bodyParser from 'body-parser';
import cors from 'cors';
import * as functions from 'firebase-functions';
import { StripeMode } from './StripeUtils';
import {StripeCreateCustomerPortalSessions} from "./StripeCreateCustomerPortalSessions";
import {ExpressFunctions} from "../util/ExpressFunctions";

const app = ExpressFunctions.createApp();

app.use(bodyParser.json());
app.use(cors({ origin: true }));

app.use((req, res) => {

    const handleRequest = async () => {

        try {

            const body: StripeCreateCustomerPortalBody = req.body;

            const session = await StripeCreateCustomerPortalSessions.create({
                stripeMode: body.mode,
                email: body.email
            })

            res.redirect(session.url);

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

export const StripeCreateCustomerPortalFunction = functions.https.onRequest(app);

export interface StripeCreateCustomerPortalBody {
    readonly mode: StripeMode;
    readonly email: string;
}

