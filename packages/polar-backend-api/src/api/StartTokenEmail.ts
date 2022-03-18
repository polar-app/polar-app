export interface IStartTokenEmailRequest {
    readonly newEmail: string;
}

export interface IStartTokenEmailResponse {
    readonly code: "ok";
}

export interface IStartTokenEmailError {
    readonly code: "email-already-being-used";
}