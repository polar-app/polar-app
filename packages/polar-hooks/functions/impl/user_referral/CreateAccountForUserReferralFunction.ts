import {ExpressFunctions} from "../util/ExpressFunctions";
import {isPresent} from "polar-shared/src/Preconditions";
import {ICreateAccountForUserReferralRequest} from "polar-backend-api/src/api/CreateAccountForUserReferral";
import {CreateAccountForUserReferrals} from "./CreateAccountForUserReferrals";

export const CreateAccountForUserReferralFunction = ExpressFunctions.createHookAsync('CreateAccountForUserReferralFunction', async (req, res) => {

    if (req.method.toUpperCase() !== 'POST') {
        ExpressFunctions.sendResponse(res, "POST required", 500, 'text/plain');
        return;
    }

    if (!isPresent(req.body)) {
        ExpressFunctions.sendResponse(res, "No request body", 500, 'text/plain');
        return;
    }

    const request: ICreateAccountForUserReferralRequest = req.body;

    const response = await CreateAccountForUserReferrals.exec(request);

    ExpressFunctions.sendResponse(res, response);

});
