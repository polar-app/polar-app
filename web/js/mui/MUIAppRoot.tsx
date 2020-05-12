import createPersistedState from "use-persisted-state";
import {MUIThemeTypeContext, ThemeType} from "./context/MUIThemeTypeContext";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import {GlobalCss} from "../../spectron0/material-ui/GlobalCss";
import * as React from "react";
import {GlobalCssSummernote} from "../../spectron0/material-ui/GlobalCssSummernote";
import {GlobalCSSBootstrap} from "../../spectron0/material-ui/GlobalCSSBootstrap";
import {FirestoreProvider} from "../../../apps/repository/js/FirestoreProvider";
import {GlobalCssMobile} from "../../spectron0/material-ui/GlobalCssMobile";

interface IProps {
    readonly children: React.ReactNode;
}

export const MUIAppRoot = (props: IProps) => {

    const usePersistedTheme = createPersistedState('theme');
    const [theme, setTheme] = usePersistedTheme<ThemeType>("dark");

    const muiTheme = createMuiTheme({
        typography: {
            htmlFontSize: 12,
            fontSize: 12
        },
        palette: {
            type: theme,
            primary: {
                // main: 'rgb(135, 141, 246)'
                main: 'rgb(103, 84, 214)'
            }
        }
    });

    return (

        <MuiThemeProvider theme={muiTheme}>
            <MUIThemeTypeContext.Provider value={{theme, setTheme}}>

                <CssBaseline/>
                <GlobalCss/>
                <GlobalCSSBootstrap/>
                <GlobalCssSummernote/>
                <GlobalCssMobile/>

                <FirestoreProvider>
                    {props.children}
                </FirestoreProvider>

            </MUIThemeTypeContext.Provider>
        </MuiThemeProvider>
    );

};
