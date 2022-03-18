export interface IVerifyTokenEmailRequest {
    newEmail: string;
    challenge: string;
}

export interface IVerifyTokenEmailError {
    code: ErrorCode
};

export interface IVerifyTokenEmailResponse {
    code: 'ok'
}

export type ErrorCode = 'no-email-for-challenge' | 'invalid-challenge';