import {ExpressFunctions} from "../util/ExpressFunctions";
import {UserRequests} from "../util/UserRequests";
import {StripeStudentDiscountFunctions} from "./StripeStudentDiscountFunctions";

export const StripeStudentDiscountFunction = ExpressFunctions.createHookAsync('StripeStudentDiscountFunction', async (req, res) => {
    return await UserRequests.executeAsync(req, res, StripeStudentDiscountFunctions.exec);
});
