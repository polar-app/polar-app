import * as React from 'react';
import {useState} from 'react';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CssBaseline from '@material-ui/core/CssBaseline';
import FolderTree from "./FolderTree";
import EnhancedTable from "./SelectTable";
import ReactVirtualizedTable from "./ReactVirtualizedTable";
import TabsDemo from "./TabsDemo";
import DropdownMenuDemo from "./DropdownMenuDemo";
import {IconsDemo} from "./IconsDemo";


export const App = () => {

    // We keep the theme in app state
    const [theme, setTheme] = useState<any>({
        typography: {
            htmlFontSize: 12,
            fontSize: 12
        },
        palette: {
            type: "dark"
        }
    });

    // we change the palette type of the theme in state
    const toggleDarkTheme = () => {
        const newPaletteType = theme.palette.type === "light" ? "dark" : "light";
        setTheme({
            palette: {
                type: newPaletteType
            }
        });
    };

    const muiTheme = createMuiTheme(theme);

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline/>
            <Container component="main" maxWidth={false} disableGutters>
                {/*<ReactVirtualizedTable/>*/}


                <FolderTree/>
                {/*<EnhancedTable/>*/}

                {/*<Button variant="contained" color="primary">*/}
                {/*    Hello World*/}
                {/*</Button>*/}

                {/*<Tags/>*/}

                {/*<ReactVirtualizedTable/>*/}

                {/*<TreeControl/>*/}
                {/*<TabsDemo/>*/}
                {/*<IconsDemo/>*/}

                {/*<DropdownMenuDemo/>*/}

            </Container>
        </MuiThemeProvider>
    );
}

