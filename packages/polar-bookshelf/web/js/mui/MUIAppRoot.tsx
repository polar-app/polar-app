import {MUIThemeTypeContext, ThemeType} from "./context/MUIThemeTypeContext";
import {GlobalCss} from "./css/GlobalCss";
import * as React from "react";
import {GlobalCSSBootstrap} from "./css/GlobalCSSBootstrap";
import {GlobalCssMobile} from "./css/GlobalCssMobile";
import CssBaseline from "@material-ui/core/CssBaseline";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {KeyboardShortcuts} from "../keyboard_shortcuts/KeyboardShortcuts";
import {UndoQueueProvider2} from "../undo/UndoQueueProvider2";
import useLocalStorageState from 'use-local-storage-state'
import {MUIErrorBoundary} from "./MUIErrorBoundary";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {PaletteOptions} from "@material-ui/core/styles/createPalette";

interface IProps {
    readonly children: React.ReactNode;
}

export const MUIAppRoot = React.memo(function MUIAppRoot(props: IProps) {

    // FIXME: this is probably wrong now...
    const [theme, setTheme] = useLocalStorageState<ThemeType>('theme', "dark");

    const muiTheme = React.useMemo(() => {

        function createDarkTheme(): PaletteOptions {
            return {
                type: 'dark',
                // primary: {
                //     main: 'rgb(103, 84, 214)',
                // },
                // secondary: {
                //     main: 'rgb(103, 84, 214)',
                // },
                // error: {
                //     main: 'rgb(103, 84, 214)',
                // },
                // warning: {
                //     main: 'rgb(103, 84, 214)',
                // },
                // info: {
                //     main: 'rgb(103, 84, 214)',
                // },
                // success: {
                //     main: 'rgb(103, 84, 214)',
                // },
                // text: {
                //     primary: '',
                //     secondary: '',
                //     disabled: '',
                //     hint: ''
                // },
                divider: '#959697',
                // action: {
                //     // active: '',
                //     // hover: '',
                //     // hoverOpacity: 10,
                //     // selected: '',
                //     // selectedOpacity: 10,
                //     // disabled: '',
                //     // disabledOpacity: 0,
                //     // disabledBackground: '',
                //     // focus: '',
                //     // focusOpacity: 0,
                //     // activatedOpacity: 0,
                // },
                background: {
                    default: '#121212',
                    paper: '#202020'
                },
            }
        }

        const background = Dictionaries.onlyDefinedProperties({
            'default': theme === 'light' ? '#ffffff' : undefined,
            'paper': theme === 'light' ? '#f2f2f2' : undefined
        });

        // return createMuiTheme({
        //     typography: {
        //         htmlFontSize: 12,
        //         fontSize: 12
        //     },
        //     palette: {
        //         type: theme,
        //         primary: {
        //             'main': 'rgb(103, 84, 214)'
        //         },
        //         background
        //         // divider: '#303236',
        //         // text: {
        //         //     primary: 'rgb(247, 248, 248)'
        //         // }
        //     }
        // });
        return createMuiTheme({
            typography: {
                htmlFontSize: 12,
                fontSize: 12
            },
            palette: createDarkTheme()
        });

    }, [theme]);

    React.useEffect(() => {
        console.log("Using MUI palette: ", JSON.stringify(muiTheme.palette, null, '  '))
    }, [muiTheme]);

    return (
        <>
            <KeyboardShortcuts/>
            <ThemeProvider theme={muiTheme}>
                <MUIThemeTypeContext.Provider value={{theme, setTheme}}>
                    <>
                        <CssBaseline/>
                        <GlobalCss/>
                        <GlobalCSSBootstrap/>
                        <GlobalCssMobile/>

                        <UndoQueueProvider2>
                            <MUIErrorBoundary>
                                <>
                                    {props.children}
                                </>
                            </MUIErrorBoundary>
                        </UndoQueueProvider2>

                    </>
                </MUIThemeTypeContext.Provider>
            </ThemeProvider>
        </>
    );

});
