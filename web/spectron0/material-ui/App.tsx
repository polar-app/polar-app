import * as React from 'react';
import {useState} from 'react';
import {createMuiTheme, MuiThemeProvider} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CssBaseline from '@material-ui/core/CssBaseline';
import DocumentRepositoryTable from "./doc_repo_table/DocumentRepositoryTable";
import {MockRepoDocInfos} from "./MockRepoDocInfos";
import {ContextMenus} from "./ContextMenus";
import {configure, GlobalHotKeys} from "react-hotkeys";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import TextField from "@material-ui/core/TextField";
import SearchBox from "./SearchBox";
// import {DocDropdownMenu} from "./MUIDocDropdownMenu";
// import { MUIDocDropdownButton } from './MUIDocDropdownButton';
import FlagIcon from "@material-ui/icons/Flag";
import { TagAutocompleteDemo } from './TagAutocompleteDemo';
import {AlertDialogDemo} from "./AlertDialogDemo";

// configure({logLevel: "debug"});

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
        // <GlobalHotKeys
        //     allowChanges={true}
        //     keyMap={globalKeyMap}>

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


                    {/*<div style={{margin: '5px'}}>*/}
                    {/*    <SearchBox/>*/}

                    {/*</div>*/}


                    {/*<TextField id="standard-search" type="search" InputProps={{*/}
                    {/*    startAdornment: (*/}
                    {/*        <FlagIcon/>*/}
                    {/*    )*/}
                    {/*}}/>*/}

                    {/*<TagAutocompleteDemo/>*/}
                    <AlertDialogDemo/>

                    {/*<DocumentRepositoryTable data={MockRepoDocInfos.create()}*/}
                    {/*                         selected={[0, 1]}*/}
                    {/*                         selectRow={NULL_FUNCTION}*/}
                    {/*                         onOpen={() => console.log('onOpen')}*/}
                    {/*                         onShowFile={() => console.log('onShowFile')}*/}
                    {/*                         onRename={() => console.log('onRename')}*/}
                    {/*                         onCopyOriginalURL={() => console.log('onCopyOriginalURL')}*/}
                    {/*                         onCopyFilePath={() => console.log('onCopyFilePath')}*/}
                    {/*                         onDelete={() => console.log('FIXME: onDelete ' + Date.now())}*/}
                    {/*                         onCopyDocumentID={() => console.log('onCopyDocumentID')}*/}
                    {/*                         onLoadDoc={(repoDocInfo) => console.log('onLoadDoc: ', repoDocInfo)}*/}
                    {/*                         onFlagged={() => console.log('onFlagged')}*/}
                    {/*                         onArchived={() => console.log('onArchived')}*/}
                    {/*/>*/}

                    {/*<Foo/>*/}
                    {/*<Foo/>*/}
                    {/*<Foo/>*/}

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
        // </GlobalHotKeys>
    );
}

