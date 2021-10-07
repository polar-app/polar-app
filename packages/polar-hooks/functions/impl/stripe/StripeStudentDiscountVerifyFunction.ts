import {ExpressFunctions} from "../util/ExpressFunctions";
import {UserRequests} from "../util/UserRequests";
import { StripeStudentDiscountVerifyFunctions } from "./StripeStudentDiscountVerifyFunctions";

export const StripeStudentDiscountVerifyFunction = ExpressFunctions.createHookAsync('StripeStudentDiscountVerifyFunction', async (req, res) => {
    return await UserRequests.executeAsync(req, res, StripeStudentDiscountVerifyFunctions.exec);
});
