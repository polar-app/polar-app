import { ISODateTimeString } from "polar-shared/src/metadata/ISODateTimeStrings";

export interface UserInterview {

    readonly email: string;

    /**
     * The last attempt
     */
    readonly lastAttempt: ISODateTimeString;

    /**
     * The last reason why we attempted to contact the user.
     */
    readonly reason: UserInterviewReason;

}

/**
 * The reason we're requesting an interview (
 */
export type UserInterviewReason = 'recent' | 'veteran' | 'churned';
