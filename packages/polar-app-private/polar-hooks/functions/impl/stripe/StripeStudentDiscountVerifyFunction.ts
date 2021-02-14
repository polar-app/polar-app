import {ExpressFunctions} from "../util/ExpressFunctions";
import {UserRequests} from "../util/UserRequests";
import { StripeStudentDiscountVerifyFunctions } from "./StripeStudentDiscountVerifyFunctions";

export const StripeStudentDiscountVerifyFunction = ExpressFunctions.createHook('StripeStudentDiscountVerifyFunction', (req, res) => {
    return UserRequests.execute(req, res, StripeStudentDiscountVerifyFunctions.exec);
});
