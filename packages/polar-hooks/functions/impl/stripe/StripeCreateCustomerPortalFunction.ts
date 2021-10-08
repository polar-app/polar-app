import {ExpressFunctions} from "../util/ExpressFunctions";
import {UserRequests} from "../util/UserRequests";
import { StripeCreateCustomerPortalFunctions } from './StripeCreateCustomerPortalFunctions';

export const StripeCreateCustomerPortalFunction = ExpressFunctions.createHookAsync('StripeCreateCustomerPortalFunction', async (req, res) => {
    return await UserRequests.executeAsync(req, res, StripeCreateCustomerPortalFunctions.exec);
});
