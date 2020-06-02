import React from "react";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

// TODO: add a true dark and sepia themes...
export type ThemeType = 'light' | 'dark';

export interface MUIThemeType {
    readonly theme: ThemeType;
    readonly setTheme: (mode: ThemeType) => void;
}

export const MUIThemeTypeContext = React.createContext<MUIThemeType>({
    theme: 'light',
    setTheme: NULL_FUNCTION
});
