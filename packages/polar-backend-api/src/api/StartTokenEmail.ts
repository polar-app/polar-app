export interface IStartTokenEmailRequest {
    readonly newEmail: string;
}

export interface IStartTokenEmailResponse {
    readonly code: "ok";
}