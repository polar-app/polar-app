import * as React from "react";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";
import {Dictionaries} from "polar-shared/src/util/Dictionaries";
import {PaletteOptions} from "@material-ui/core/styles/createPalette";
import {useFirestorePrefs} from "../../../../apps/repository/js/persistence_layer/FirestorePrefs";
import {useErrorHandler} from "../../mui/MUIErrorHandler";
import {MUIThemeTypeContext, ThemeType} from "../../mui/context/MUIThemeTypeContext";
import {useFeatureEnabled} from "../../features/FeaturesRegistry";

interface IProps {
    readonly children: React.ReactNode;
}

export const MUIAppRootUsingFirestorePrefs = React.memo(function MUIAppRootUsingFirestorePrefs(props: IProps) {

    const firestorePrefs = useFirestorePrefs();

    const theme = React.useMemo((): ThemeType => firestorePrefs.get('theme').getOrElse('dark') as ThemeType, [firestorePrefs]);

    // whether we should use the new design...
    const useRedesign = useFeatureEnabled('use-redesign-theme');

    const errorHandler = useErrorHandler();

    // the setter for the theme
    const setTheme = React.useCallback((theme: 'light' | 'dark') => {

        async function doAsync() {
            firestorePrefs.set('theme', theme);
            await firestorePrefs.commit();
        }

        doAsync().catch(errorHandler);

    }, [firestorePrefs, errorHandler]);

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

    React.useEffect(() => {
        console.log("Using MUI palette: ", JSON.stringify(redesignTheme.palette, null, '  '))
    }, [redesignTheme]);

    const muiTheme = React.useMemo(() => useRedesign ? redesignTheme : legacyTheme, [useRedesign, redesignTheme, legacyTheme]);

    return (
        <>
            <ThemeProvider theme={muiTheme}>
                <MUIThemeTypeContext.Provider value={{theme, setTheme}}>
                    {props.children}
                </MUIThemeTypeContext.Provider>
            </ThemeProvider>
        </>
    );

});

