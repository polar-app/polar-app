import {Strings} from "polar-shared/src/util/Strings";
import {AuthChallenges} from "./AuthChallenges";
import {Sendgrid} from "../Sendgrid";
import {ExpressFunctions} from "../util/ExpressFunctions";
import { isPresent } from "polar-shared/src/Preconditions";

export interface IStartTokenAuthRequest {
    readonly email: string;
}

export interface IStartTokenErrorResponse {
    readonly code: 'unable-to-send-email';
    readonly status: 'unable-to-send-email';
    readonly message: string;
    readonly email: string;
}

export interface IStartTokenAuthResponse {
    readonly code: 'ok';
    readonly status: 'ok';
}

interface IChallenge {
    readonly p0: string;
    readonly p1: string;
    readonly value: string;
}

export function createChallenge(): IChallenge {

    const n0 = Math.floor(Math.random() * 999);
    const n1 = Math.floor(Math.random() * 999);

    const p0 = Strings.lpad(n0, '0', 3);
    const p1 = Strings.lpad(n1, '0', 3);

    const value = p0 + p1;
    return {value, p0, p1};

}

export const StartTokenAuthFunction = ExpressFunctions.createHookAsync('StartTokenAuthFunction', async (req, res) => {

    if (req.method.toUpperCase() !== 'POST') {
        ExpressFunctions.sendResponse(res, "POST required", 500, 'text/plain');
        return;
    }

    if (! isPresent(req.body)) {
        ExpressFunctions.sendResponse(res, "No request body", 500, 'text/plain');
        return;
    }

    const request: IStartTokenAuthRequest = req.body;

    console.log("Handling request: ", typeof request, request);

    const {email} = request;

    // TODO: the challenges should expire.
    const challenge = createChallenge()

    await AuthChallenges.write(email, challenge.value)

    try {

        await Sendgrid.send({
            to: email,
            from: 'noreply@getpolarized.io',
            subject: `Please Sign in to Polar with code ${challenge.p0} ${challenge.p1}`,
            html: `<p>Please use the following code to sign in to Polar:</p><p><span style="font-size: 30px;"><b>${challenge.p0} ${challenge.p1}</b></span></p>`
        });

        const response: IStartTokenAuthResponse = {
            code: 'ok',
            status: "ok"
        };

        ExpressFunctions.sendResponse(res, response);

    } catch (e) {

        const response: IStartTokenErrorResponse = {
            code: 'unable-to-send-email',
            status: "unable-to-send-email",
            message: e.message,
            email
        };

        ExpressFunctions.sendResponse(res, response);

    }


});
