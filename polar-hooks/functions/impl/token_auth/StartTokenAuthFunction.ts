import {Strings} from "polar-shared/src/util/Strings";
import {AuthChallenges} from "./AuthChallenges";
import {Sendgrid} from "../Sendgrid";
import {ExpressFunctions} from "../util/ExpressFunctions";

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

function createChallenge(): IChallenge {

    const n0 = Math.random() * 999;
    const n1 = Math.random() * 999;

    const p0 = Strings.lpad(n0, '0', 3);
    const p1 = Strings.lpad(n1, '0', 3);

    const value = p0 + p1;
    return {value, p0, p1};

}

export const StartTokenAuthFunction = ExpressFunctions.createHookAsync(async (req, res) => {

    const request: IStartTokenAuthRequest = req.body;

    const {email} = request;
    const challenge = createChallenge()

    await AuthChallenges.write(email, challenge.value)

    await Sendgrid.send({
        to: email,
        from: 'noreply@getpolarized.io',
        subject: 'Please Sign in to Polar',
        html: `Please use the code <b>${challenge.p0} ${challenge.p1}</b> to login to Polar.`
    })

    const response: IStartTokenAuthResponse = {
        status: "ok"
    };

    ExpressFunctions.sendResponse(res, response);

});
