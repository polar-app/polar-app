import * as React from "react";
import { Callback } from "polar-shared/src/util/Functions";
export declare function isInputCompleteEvent(type: InputCompletionType, event: KeyboardEvent): boolean;
interface InputCompleteListenerOpts {
    readonly onComplete: () => void;
    readonly onCancel?: Callback;
    readonly completable?: () => boolean;
    readonly type: InputCompletionType;
}
export declare function useInputCompleteListener(opts: InputCompleteListenerOpts): void;
export declare type InputCompletionType = 'enter' | 'meta+enter';
interface IProps extends InputCompleteListenerOpts {
    readonly children: JSX.Element;
    readonly type: InputCompletionType;
    readonly noHint?: boolean;
}
export declare const InputCompleteListener: React.MemoExoticComponent<(props: IProps) => JSX.Element>;
export {};
