import createPersistedState from "use-persisted-state";
import {MUIThemeTypeContext, ThemeType} from "./context/MUIThemeTypeContext";
import {GlobalCss} from "./css/GlobalCss";
import * as React from "react";
import {GlobalCssSummernote} from "./css/GlobalCssSummernote";
import {GlobalCSSBootstrap} from "./css/GlobalCSSBootstrap";
import {GlobalCssMobile} from "./css/GlobalCssMobile";
import CssBaseline from "@material-ui/core/CssBaseline";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {KeyboardShortcuts} from "../keyboard_shortcuts/KeyboardShortcuts";
import {UndoQueueProvider} from "../undo/UndoQueueProvider";

interface IProps {
    readonly children: React.ReactNode;
}

export const MUIAppRoot = React.memo((props: IProps) => {

    const usePersistedTheme = createPersistedState('theme');
    const [theme, setTheme] = usePersistedTheme<ThemeType>("dark");

    // TODO play responsiveFontSizes in MUI...
    const muiTheme = React.useMemo(() => createMuiTheme({
        typography: {
            htmlFontSize: 12,
            fontSize: 12
        },
        palette: {
            type: theme,
            primary: {
                'main': 'rgb(103, 84, 214)'
            },
            // background: {
            //     'default': '#1b1b1b',
            //     'paper': '#343434'
            // }
        }
    }), [theme]);

    return (
        <>
            <KeyboardShortcuts/>
            <ThemeProvider theme={muiTheme}>
                <MUIThemeTypeContext.Provider value={{theme, setTheme}}>
                    <>
                        <CssBaseline/>
                        <GlobalCss/>
                        <GlobalCSSBootstrap/>
                        <GlobalCssSummernote/>
                        <GlobalCssMobile/>

                        <UndoQueueProvider>
                            <>
                                {props.children}
                            </>
                        </UndoQueueProvider>

                    </>
                </MUIThemeTypeContext.Provider>
            </ThemeProvider>
        </>
    );

});

MUIAppRoot.displayName='MUIAppRoot';