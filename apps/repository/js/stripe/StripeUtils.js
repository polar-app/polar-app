"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripeUtils = void 0;
const stripe_js_1 = require("@stripe/stripe-js");
var StripeUtils;
(function (StripeUtils) {
    function createURL(path) {
        function createHost() {
            switch (StripeUtils.stripeMode()) {
                case "test":
                    return 'us-central1-polar-cors-beta.cloudfunctions.net';
                case "live":
                    return 'us-central1-polar-cors.cloudfunctions.net';
            }
        }
        const host = createHost();
        return `https://${host}${path}`;
    }
    StripeUtils.createURL = createURL;
    function stripeMode() {
        const stripeApiKey = getStripeAPIKey();
        return stripeApiKey.startsWith("pk_test_") ? 'test' : 'live';
    }
    StripeUtils.stripeMode = stripeMode;
    function getStripeAPIKey() {
        return localStorage.getItem('stripe_api_key') || 'pk_live_nuUlFGZzCqFCnx19rAfGBO9900Fx3Mpi3m';
    }
    StripeUtils.getStripeAPIKey = getStripeAPIKey;
    function createStripe() {
        return __awaiter(this, void 0, void 0, function* () {
            const stripeApiKey = getStripeAPIKey();
            return yield stripe_js_1.loadStripe(stripeApiKey);
        });
    }
    StripeUtils.createStripe = createStripe;
})(StripeUtils = exports.StripeUtils || (exports.StripeUtils = {}));
//# sourceMappingURL=StripeUtils.js.map