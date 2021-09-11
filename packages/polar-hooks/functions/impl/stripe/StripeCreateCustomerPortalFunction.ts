import {ExpressFunctions} from "../util/ExpressFunctions";
import {UserRequests} from "../util/UserRequests";
import { StripeCreateCustomerPortalFunctions } from './StripeCreateCustomerPortalFunctions';

export const StripeCreateCustomerPortalFunction = ExpressFunctions.createHook('StripeCreateCustomerPortalFunction', (req, res) => {
    return UserRequests.execute(req, res, StripeCreateCustomerPortalFunctions.exec);
});
