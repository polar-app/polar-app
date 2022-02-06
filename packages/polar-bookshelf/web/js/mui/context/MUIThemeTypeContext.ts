import React from "react";

// TODO: add a true dark and sepia themes...
export type ThemeType = 'light' | 'dark';

export interface MUIThemeType {
    readonly theme: ThemeType;
}

export const MUIThemeTypeContext = React.createContext<MUIThemeType>({
    theme: 'dark',
});
