import {Strings} from "polar-shared/src/util/Strings";
import {AuthChallenges} from "./AuthChallenges";
import {Sendgrid} from "../Sendgrid";
import {ExpressFunctions} from "../util/ExpressFunctions";
import { isPresent } from "polar-shared/src/Preconditions";

export interface IStartTokenAuthRequest {
    readonly email: string;
}

export interface IStartTokenAuthResponse {
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

    if (! isPresent(req.body)) {
        ExpressFunctions.sendResponse(res, "No request body", 500, 'text/plain');
        return;
    }

    const request: IStartTokenAuthRequest = req.body;

    const {email} = request;
    const challenge = createChallenge()

    await AuthChallenges.write(email, challenge.value)

    await Sendgrid.send({
        to: email,
        from: 'noreply@getpolarized.io',
        subject: `Please Sign in to Polar with code ${challenge.p0} ${challenge.p1}`,
        html: `<p>Please use the following code to sign in to Polar:</p><p><span style="font-size: 30px;"><b>${challenge.p0} ${challenge.p1}</b></span></p>`
    })

    const response: IStartTokenAuthResponse = {
        status: "ok"
    };

    ExpressFunctions.sendResponse(res, response);

});
