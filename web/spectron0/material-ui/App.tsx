import * as React from 'react';
import {useState} from 'react';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CssBaseline from '@material-ui/core/CssBaseline';
import FolderTree from "./FolderTree";
import DocumentRepositoryTable from "./doc_repo_table/DocumentRepositoryTable";
import ReactVirtualizedTable from "./ReactVirtualizedTable";
import TabsDemo from "./TabsDemo";
import DropdownMenuDemo from "./DropdownMenuDemo";
import {IconsDemo} from "./IconsDemo";
import Grid from "@material-ui/core/Grid";
import TableCell from "@material-ui/core/TableCell";
import Chip from "@material-ui/core/Chip";
import AutocompleteTags from "./AutocompleteTags";
import Button from '@material-ui/core/Button';
import DialogDemo from "./DialogDemo";
import Box from "@material-ui/core/Box";
import {DocButtons, DocButtonsDemo} from "./DocButtonsDemo";
import {MockRepoDocInfos} from "./MockRepoDocInfos";
// import {DocDropdownMenu} from "./MUIDocDropdownMenu";
// import { MUIDocDropdownButton } from './MUIDocDropdownButton';


export const App = () => {

    // We keep the theme in app state
    const [theme, setTheme] = useState<any>({
        typography: {
            htmlFontSize: 12,
            fontSize: 12
        },
        palette: {
            type: "light"
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

                {/*<Grid*/}
                {/*      container*/}
                {/*      spacing={1}*/}
                {/*      direction="row"*/}
                {/*      alignItems="center"*/}
                {/*>*/}
                {/*    <Grid item>*/}
                {/*        <Chip label="hello"/>*/}
                {/*    </Grid>*/}


                {/*    <Grid item>*/}
                {/*        <Chip label="world"/>*/}
                {/*    </Grid>*/}

                {/*</Grid>*/}

                {/*<FolderTree/>*/}

                {/*<DialogDemo/>*/}

                {/*<Box m={1}>*/}
                {/*    <AutocompleteTags/>*/}
                {/*</Box>*/}
                <DocumentRepositoryTable data={MockRepoDocInfos.create()}
                                         onLoadDoc={(repoDocInfo) => console.log('onLoadDoc: ', repoDocInfo)}
                />


                {/*<div style={{display: 'flex'}}>*/}
                {/*    <div style={{flexGrow: 1}}>*/}

                {/*    </div>*/}
                {/*    <div>*/}
                {/*        <MUIDocDropdownButton/>*/}
                {/*    </div>*/}
                {/*</div>*/}

                {/*<DocButtonsDemo/>*/}

                {/*<Button variant="contained" color="primary" onClick={() => console.log('hello')}>*/}
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

