import React from "react";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

export type UIModeType = 'light' | 'dark';

export interface UIMode {
    readonly mode: UIModeType;
    readonly setMode: (mode: UIModeType) => void;
}

export const UIModeContext = React.createContext<UIMode>({
    mode: 'light',
    setMode: NULL_FUNCTION
});
