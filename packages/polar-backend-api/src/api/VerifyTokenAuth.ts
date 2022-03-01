export interface IVerifyTokenAuthRequest {
    readonly email: string;
    readonly challenge: string;
}

export interface IVerifyTokenAuthResponseError {
    readonly code: 'no-email-for-challenge' | 'invalid-challenge' | 'registrations-disabled';
}

export interface IVerifyTokenAuthResponse {

    /**
     * The code / error.
     */
    readonly code: 'ok';

    /**
     * A generated custom token on the backend.
     */
    readonly customToken: string;

    readonly isNewUser: boolean;

}