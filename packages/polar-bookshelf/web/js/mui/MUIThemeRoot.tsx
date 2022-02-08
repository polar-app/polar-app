import * as React from "react";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {PaletteOptions} from "@material-ui/core/styles/createPalette";
import CssBaseline from "@material-ui/core/CssBaseline";
import {MUIThemeTypeContext} from "./context/MUIThemeTypeContext";
import {GlobalCss} from "./css/GlobalCss";
import {GlobalCssMobile} from "./css/GlobalCssMobile";
import {GlobalCSSBootstrap} from "./css/GlobalCSSBootstrap";

interface IProps {
    readonly children: React.ReactNode;
    readonly useRedesign: boolean;
    readonly darkMode: boolean;

}

export const MUIThemeRoot = React.memo(function MUIThemeRoot(props: IProps) {

    const {darkMode, useRedesign} = props;

    const theme = React.useMemo(() => darkMode ? 'dark' : 'light', [darkMode]);

    // whether we should use the new design...

    const legacyTheme = React.useMemo(() => {

        const background = Dictionaries.onlyDefinedProperties({
            'default': theme === 'light' ? '#ffffff' : undefined,
            'paper': theme === 'light' ? '#f2f2f2' : undefined
        });

        return createMuiTheme({
            typography: {
                htmlFontSize: 12,
                fontSize: 12
            },
            palette: {
                type: theme,
                primary: {
                    'main': 'rgb(103, 84, 214)'
                },
                background
                // divider: '#303236',
                // text: {
                //     primary: 'rgb(247, 248, 248)'
                // }
            }
        });

    }, [theme]);

    const redesignTheme = React.useMemo(() => {

        function createLightTheme(): PaletteOptions {
            return {
                type: 'light',
                divider: '#D4D8D9',
                background: {
                    default: '#FAFAFA',
                    paper: '#202020'
                },
            }
        }

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

        return createMuiTheme({
            typography: {
                htmlFontSize: 12,
                fontSize: 12
            },
            palette: theme === 'light' ? createLightTheme() : createDarkTheme()
        });

    }, [theme]);

    // React.useEffect(() => {
    //     console.log("Using MUI palette: ", JSON.stringify(redesignTheme.palette, null, '  '))
    // }, [redesignTheme]);

    const muiTheme = React.useMemo(() => useRedesign ? redesignTheme : legacyTheme, [useRedesign, redesignTheme, legacyTheme]);

    return (
        <>
            <ThemeProvider theme={muiTheme}>
                <MUIThemeTypeContext.Provider value={{theme}}>

                    <>
                        <CssBaseline/>
                        <GlobalCss/>
                        <GlobalCSSBootstrap/>
                        <GlobalCssMobile/>

                        {props.children}

                    </>
                </MUIThemeTypeContext.Provider>
            </ThemeProvider>
        </>
    );

});

