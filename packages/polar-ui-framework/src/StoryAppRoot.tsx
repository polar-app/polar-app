import * as React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import {createMuiTheme, ThemeProvider} from "@material-ui/core/styles";

interface IProps {
    readonly children: React.ReactNode;
}

export const StoryAppRoot = React.memo(function MUIAppRoot(props: IProps) {

    const muiTheme = React.useMemo(() => {

        return createMuiTheme({
            typography: {
                htmlFontSize: 12,
                fontSize: 12
            },
            palette: {
                type: 'dark',
                primary: {
                    'main': 'rgb(103, 84, 214)'
                },
            }
        });

    }, []);

    return (
        <>
            <ThemeProvider theme={muiTheme}>
                <>
                    <CssBaseline/>
                    {props.children}

                </>
            </ThemeProvider>
        </>
    );

});
