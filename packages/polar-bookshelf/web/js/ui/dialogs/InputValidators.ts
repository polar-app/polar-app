export interface InvalidInput {
    readonly message: string;
}

export const NULL_INPUT_VALIDATOR = () => undefined;

/**
 * Return undefined if the input is valid or a InvalidInput object if there
 * was an error.
 */
export type InputValidator = (value: string) => InvalidInput | undefined;

