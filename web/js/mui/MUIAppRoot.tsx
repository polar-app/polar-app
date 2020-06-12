import createPersistedState from "use-persisted-state";
import {MUIThemeTypeContext, ThemeType} from "./context/MUIThemeTypeContext";
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import CssBaseline from "@material-ui/core/CssBaseline";
import {GlobalCss} from "./css/GlobalCss";
import * as React from "react";
import {GlobalCssSummernote} from "./css/GlobalCssSummernote";
import {GlobalCSSBootstrap} from "./css/GlobalCSSBootstrap";
import {FirestoreProvider} from "../../../apps/repository/js/FirestoreProvider";
import {GlobalCssMobile} from "./css/GlobalCssMobile";
import {ActiveHotKeyBindings} from "../hotkeys/ActiveHotKeyBindings";
import {UserInfoProvider} from "../apps/repository/auth_handler/UserInfoProvider";

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

                <ActiveHotKeyBindings/>

                <FirestoreProvider>
                    <UserInfoProvider>
                        {props.children}
                    </UserInfoProvider>
                </FirestoreProvider>

            </MUIThemeTypeContext.Provider>
        </MuiThemeProvider>
    );

};
