import {IDUser} from "../util/IDUsers";
import {StudentDiscountUniversities, StudentDiscountVerifications} from "./StripeStudentDiscountFunctions";
import {StripeMode, StripeUtils} from "./StripeUtils";
import {University} from "polar-shared/src/util/Universities";
import {IDStr} from "polar-shared/src/util/Strings";

export interface StripeStudentDiscountVerifyRequest {

    /**
     * The secret...
     */
    readonly s: string;

    readonly id: string;

}

export interface StripeStudentDiscountVerifyResponse {

    /**
     * The resulting discount code.
     */
    readonly code: string;

}

export interface StripeStudentDiscountError {
    readonly error: 'no-verification' | 'invalid-secret' | 'no-university';
}

export namespace StripeStudentDiscountVerifyFunctions {

    export async function exec(idUser: IDUser,
                               request: StripeStudentDiscountVerifyRequest): Promise<StripeStudentDiscountVerifyResponse | StripeStudentDiscountError> {

        const {id} = request;

        // *** read verification from datastore
        const studentDiscountVerification = await StudentDiscountVerifications.read(id)

        if (! studentDiscountVerification) {
            return {
                error: "no-verification"
            }
        }

        const {secret, email, stripeMode} = studentDiscountVerification;

        // *** verify the secret

        if (secret !== request.s) {
            return {
                error: "invalid-secret"
            }
        }

        // *** get the university to compute the code.

        const university = StudentDiscountUniversities.getUniversityForEmail(studentDiscountVerification.email);

        if (! university) {
            return {
                error: "no-university"
            };
        }

        // *** compute the discount for the uni

        const percentDiscount = StudentDiscounts.computeDiscountForUniversity(university);

        // *** compute the promo code.

        const code = await StripeStudentDiscountPromotionCodes.create(stripeMode, email, university, percentDiscount);

        return {
            code
        };

    }

}

namespace StripeStudentDiscountPromotionCodes {

    import StudentDiscountPercentage = StudentDiscounts.StudentDiscountPercentage;

    export async function create(stripeMode: StripeMode,
                                 email: string,
                                 university: University,
                                 percentDiscount: StudentDiscountPercentage): Promise<IDStr> {

        const stripe = StripeUtils.getStripe(stripeMode);

        const coupon = 'student_' + percentDiscount;

        const promotionCode = await stripe.promotionCodes.create({
            coupon,
            max_redemptions: 1,
            metadata: {
                email,
                university_id: university.id,
                university_domain: university.domain
            }
        });

        return promotionCode.id;

    }

}

namespace StudentDiscounts {

    export type StudentDiscountPercentage = 10 | 20 | 30 | 40 | 50 | 60 | 70 | 80 | 90;

    export function computeDiscountForUniversity(university: University | undefined | boolean): StudentDiscounts.StudentDiscountPercentage {
        return 50;
    }

}
