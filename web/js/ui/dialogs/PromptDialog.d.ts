import React from 'react';
import { InputValidator } from "./InputValidators";
export interface PromptDialogProps {
    readonly title: string;
    readonly label?: string;
    readonly description?: string;
    readonly defaultValue?: string;
    readonly placeholder?: string;
    readonly autoFocus?: boolean;
    readonly inputValidator?: InputValidator;
    readonly type?: 'email' | 'number' | 'search' | 'password';
    readonly onCancel: () => void;
    readonly onDone: (value: string) => void;
    readonly autoComplete?: string;
}
export declare const PromptDialog: React.MemoExoticComponent<(props: PromptDialogProps) => JSX.Element>;
