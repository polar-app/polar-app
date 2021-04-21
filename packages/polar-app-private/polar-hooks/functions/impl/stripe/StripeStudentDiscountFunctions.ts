import {IDUser} from "../util/IDUsers";
import {Hashcodes} from "polar-shared/src/util/Hashcodes";
import {Sendgrid} from "../Sendgrid";
import {Firestore} from "../util/Firestore";
import {Emails} from "polar-shared/src/util/Emails";
import {Universities, University} from "polar-shared/src/util/Universities";
import {Domains} from "polar-shared/src/util/Domains";
import {Arrays} from "polar-shared/src/util/Arrays";
import { StripeMode } from "./StripeUtils";

export interface StripeStudentDiscountRequest {
    readonly email: string;
    readonly stripeMode: StripeMode;
}

export interface StripeStudentDiscountResponse {
}

export interface StripeStudentDiscountError {
    readonly error: 'no-domain' | 'not-university-domain';
}

export namespace StripeStudentDiscountFunctions {

    export async function exec(idUser: IDUser,
                               request: StripeStudentDiscountRequest): Promise<StripeStudentDiscountResponse | StripeStudentDiscountError> {

        const {email, stripeMode} = request;

        // *** verify that this is a university domain

        if (! StudentDiscountUniversities.getUniversityForEmail(email)) {
            return {
                error: "not-university-domain"
            }
        }

        // ** create a verification nonce

        const secret = Hashcodes.createRandomID();
        const id = Hashcodes.create(email);

        // *** write it to firestore
        await StudentDiscountVerifications.write(stripeMode, id, email, secret);

        // *** send the user a verification email

        const link = `https://us-central1-polar-32b0f.cloudfunctions.net/stripeStudentDiscountVerify?s=${secret}&id=${id}`;

        await Sendgrid.send({
            to: email,
            from: 'noreply@getpolarized.io',
            subject: "Verify your student discount",
            text: `Please click the following link to verify your student discount: \n\n${link}`
        });

        return {};

    }


}

export namespace StudentDiscountUniversities {

    export function getUniversityForEmail(email: string): University | undefined {

        const domain = Emails.toDomain(email);

        if (! domain) {
            return undefined;
        }

        const subdomains = Domains.computeAllSubdomains(domain);

        const universities = subdomains.map(Universities.getByDomain)
            .filter(current => current !== undefined);

        return Arrays.first(universities);

    }

}

export namespace StudentDiscountVerifications {

    const COLLECTION = 'student_discount_verification';

    export interface IStudentDiscountVerification {
        readonly id: string;
        readonly email: string;
        readonly secret: string;
        readonly stripeMode: StripeMode;
    }

    export async function write(stripeMode: StripeMode,
                                id: string,
                                email: string,
                                secret: string) {

        const firestore = Firestore.getInstance();
        const ref = firestore.collection(COLLECTION).doc(id);

        const studentDiscountVerification: IStudentDiscountVerification = {
            stripeMode,
            id,
            email,
            secret
        }

        await ref.set(studentDiscountVerification);
    }

    export async function read(id: string): Promise<IStudentDiscountVerification | undefined> {

        const firestore = Firestore.getInstance();

        const ref = firestore.collection(COLLECTION).doc(id);

        const doc = await ref.get();

        return <IStudentDiscountVerification> doc.data();

    }

}
