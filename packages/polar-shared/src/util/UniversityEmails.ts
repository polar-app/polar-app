import {EmailStr} from "./Strings";
import {Emails} from "./Emails";
import {Universities} from "./Universities";
import {University} from "./University";

export namespace UniversityEmails {

    /**
     * Get the university by the domain of the given email.
     */
    export function getUniversityByEmailDomain(email: EmailStr): University |  undefined {

        const domain = Emails.toDomain(email);

        if (! domain) {
            return undefined;
        }

        return Universities.getByDomain(domain);

    }

}
