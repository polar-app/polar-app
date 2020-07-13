import createPersistedState from "use-persisted-state";
import {MUIThemeTypeContext, ThemeType} from "./context/MUIThemeTypeContext";
import {GlobalCss} from "./css/GlobalCss";
import * as React from "react";
import {GlobalCssSummernote} from "./css/GlobalCssSummernote";
import {GlobalCSSBootstrap} from "./css/GlobalCSSBootstrap";
import {FirestoreProvider} from "../../../apps/repository/js/FirestoreProvider";
import {GlobalCssMobile} from "./css/GlobalCssMobile";
import {ActiveHotKeyBindings} from "../hotkeys/ActiveHotKeyBindings";
import {UserInfoProvider} from "../apps/repository/auth_handler/UserInfoProvider";
import {MUIDialogController} from "./dialogs/MUIDialogController";
import CssBaseline from "@material-ui/core/CssBaseline";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { BrowserTabsStoreProvider } from "../browser_tabs/BrowserTabsStore";

interface IProps {
    readonly children: React.ReactNode;
}

export const MUIAppRoot = (props: IProps) => {

    const usePersistedTheme = createPersistedState('theme');
    const [theme, setTheme] = usePersistedTheme<ThemeType>("dark");

    // TODO play responsiveFontSizes ...
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
                <BrowserTabsStoreProvider>
                    <>
                        <CssBaseline/>
                        <GlobalCss/>
                        <GlobalCSSBootstrap/>
                        <GlobalCssSummernote/>
                        <GlobalCssMobile/>

                        <ActiveHotKeyBindings/>

                        <FirestoreProvider>
                            <UserInfoProvider>
                                <MUIDialogController>
                                    {props.children}
                                </MUIDialogController>
                            </UserInfoProvider>
                        </FirestoreProvider>
                    </>
                </BrowserTabsStoreProvider>

            </MUIThemeTypeContext.Provider>
        </MuiThemeProvider>
    );

};
