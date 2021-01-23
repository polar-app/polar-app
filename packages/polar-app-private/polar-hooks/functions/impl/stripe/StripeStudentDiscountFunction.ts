import {ExpressFunctions} from "../util/ExpressFunctions";
import {UserRequests} from "../util/UserRequests";
import {StripeStudentDiscountFunctions} from "./StripeStudentDiscountFunctions";

export const StripeStudentDiscountFunction = ExpressFunctions.createHook((req, res) => {
    return UserRequests.execute(req, res, StripeStudentDiscountFunctions.exec);
});
