import * as React from "react";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {PaletteOptions} from "@material-ui/core/styles/createPalette";
import {useFirestorePrefs} from "../../../../apps/repository/js/persistence_layer/FirestorePrefs";
import {MUIThemeTypeContext} from "../../mui/context/MUIThemeTypeContext";
import {useFeatureEnabled} from "../../features/FeaturesRegistry";
import CssBaseline from "@material-ui/core/CssBaseline";
import {GlobalCss} from "../../mui/css/GlobalCss";
import {GlobalCSSBootstrap} from "../../mui/css/GlobalCSSBootstrap";
import {GlobalCssMobile} from "../../mui/css/GlobalCssMobile";

interface IProps {
    readonly children: React.ReactNode;
}

export const MUIAppRootUsingFirestorePrefs = React.memo(function MUIAppRootUsingFirestorePrefs(props: IProps) {

    const firestorePrefs = useFirestorePrefs();

    const darkMode = React.useMemo(() => firestorePrefs.get('dark-mode').getOrElse('true') === 'true', [firestorePrefs]);

    const theme = React.useMemo(() => darkMode ? 'dark' : 'light', [darkMode]);

    // whether we should use the new design...
    const useRedesign = useFeatureEnabled('use-redesign-theme');

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
                background: {
                    default: '#FAFAFA',
                    paper: '#F1F1F1'
                },
                divider: '#D4D8D9',
                text: {
                    primary: '#202020',
                    secondary: '#383838',
                    disabled: '#9CA3B1',
                    hint: '#959697'
                }
            }
        }

        function createDarkTheme(): PaletteOptions {
            return {
                type: 'dark',
                primary: {
                    main: '#B4C6EF',
                },
                secondary: {
                    main: '#070F21',
                },
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
                text: {
                    primary: '#FAFAFA',
                    secondary: '#DADADA',
                    disabled: '#5F6062',
                    hint: '#F1F1F1'
                },
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
                    default: '#18191A',
                    paper: '#010409'
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

    React.useEffect(() => {
        console.log("Using MUI palette: ", JSON.stringify(redesignTheme.palette, null, '  '))
    }, [redesignTheme]);

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

