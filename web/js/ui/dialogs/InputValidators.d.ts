export interface InvalidInput {
    readonly message: string;
}
export declare const NULL_INPUT_VALIDATOR: () => undefined;
export declare type InputValidator = (value: string) => InvalidInput | undefined;
