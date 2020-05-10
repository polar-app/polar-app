import * as React from 'react';
import {useEffect, useState} from 'react';
import {
    createMuiTheme,
    MuiThemeProvider,
    darken,
    hexToRgb
} from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import CssBaseline from '@material-ui/core/CssBaseline';
import {MockRepoDocInfos} from "./MockRepoDocInfos";
import {ContextMenus} from "./ContextMenus";
import {configure, GlobalHotKeys} from "react-hotkeys";
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";
import TextField from "@material-ui/core/TextField";
import MUISearchBox from "./MUISearchBox";
// import {DocDropdownMenu} from "./MUIDocDropdownMenu";
// import { MUIDocDropdownButton } from './MUIDocDropdownButton';
import FlagIcon from "@material-ui/icons/Flag";
import { TagAutocompleteDemo } from './TagAutocompleteDemo';
import {AlertDialogDemo} from "./dialogs/AlertDialogDemo";
import {PromptDialogDemo} from "./dialogs/PromptDialogDemo";
import Alert from "@material-ui/lab/Alert";
import Snackbar from "@material-ui/core/Snackbar";
import {InputValidationErrorSnackbar} from "./dialogs/InputValidationErrorSnackbar";
import {MUITagInputControl} from "../../../apps/repository/js/MUITagInputControl";
import {MockTags} from "./MockTags";
import MUICreatableAutocomplete, {
    RelatedOptionsCalculator,
    ValueAutocompleteOption
} from "./autocomplete/MUICreatableAutocomplete";
import {Tag} from "polar-shared/src/tags/Tags";
import {arrayStream} from "polar-shared/src/util/ArrayStreams";
import {MUITagInputControls} from "../../../apps/repository/js/MUITagInputControls";
import {MUITreeView} from './treeview2/MUITreeView';
import {MUIHelpMenu} from "./MUIHelpMenu";
import {MUIMenu} from "./dropdown_menu/MUIMenu";
import MenuItem from "@material-ui/core/MenuItem";
import MenuList from "@material-ui/core/MenuList";
import SettingsIcon from '@material-ui/icons/Settings';
import {ExampleDropdownMenu} from "./dropdown_menu/ExampleDropdownMenu";
import {MUIDialogController} from "./dialogs/MUIDialogController";
import dialog = Electron.dialog;
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import { GlobalCss } from './GlobalCss';
import {MUIPaperToolbar} from "./MUIPaperToolbar";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import CloseIcon from "@material-ui/icons/Close";
import {MUIToggleButton} from "../../js/ui/MUIToggleButton";
import {MUISearchBox2} from "./MUISearchBox2";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import Input from "@material-ui/core/Input";
import OutlinedInput from "@material-ui/core/OutlinedInput";
import InputAdornment from "@material-ui/core/InputAdornment";
import SearchIcon from "@material-ui/icons/Search";
import {AutocompleteDialog} from "../../js/ui/dialogs/AutocompleteDialog";
import {MyResponsivePie} from "./PieDemo";
import LinearProgress from '@material-ui/core/LinearProgress';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import {UserAvatar} from "../../js/ui/cloud_auth/UserAvatar";
import {AccountControl} from "../../js/ui/cloud_auth/AccountControl";
import {MUIGridLayoutTest} from "./dropdown_menu/MUIGridLayoutTest";
import {FadeDemo} from "./FadeDemo";
import {MUIHoverContextDemo} from "../../js/mui/context/MUIHoverContextDemo";
import {AppBarDemo} from "./AppBarDemo";
import { SharedStateTest } from './SharedStateTest';
import {SharedIntermediateContextTest} from "./SharedIntermediateContextTest";
import {DeleteConfirmationDemo} from "./DeleteConfirmationDemo";
import {ContextMemoTest} from "./ContextTest";
import {TagDescriptor} from "polar-shared/src/tags/TagDescriptors";
import {TagNodes} from "../../js/tags/TagNodes";
import {MyContextStoreComponent} from "./store2/ContextStore";
import {HookStateDemo} from "./store2/HookState";
import {ObservableStoreDemo} from "./store/demo/ObservableStoreDemo";
import { ObservableStoreDemo2 } from './store/demo2/ObservableStoreDemo2';
import {MUITreeViewDemo} from "./treeview2/MUITreeViewDemo";
import {ComponentCacheDemo} from "./ComponentCacheDemo";
import { MUIContextMenuDemo } from './doc_repo_table/MUIContextMenuDemo';
import {ReviewerDemo} from "../ui-components/ReviewerDemo";
import {MUIAppRoot} from "../../js/mui/MUIAppRoot";
import { UseAsyncWithCallbacksDemo } from './UseAsyncWithCallbacksDemo';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Loading, MUIAsyncLoader} from "./MUIAsyncLoader";
import {FirestoreProvider} from "../../../apps/repository/js/FirestoreProvider";
import {CloudSyncConfiguredDialog} from "../../js/ui/cloud_auth/CloudSyncConfiguredDialog";
import {ColorButton} from "../../../apps/repository/js/reviewer/ColorButton";
import red from "@material-ui/core/colors/red";
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

    const tags = MockTags.create();

    const tagOptions = tags.map(MUITagInputControls.toAutocompleteOption);

    const relatedOptionsCalculator: RelatedOptionsCalculator<Tag> = () => {
        return tagOptions.slice(1, 3);
    };

    // MUITagInputControls.prompt({
    //     availableTags: tags,
    //     existingTags: () => [],
    //     onChange: NULL_FUNCTION,
    //     onCancel: NULL_FUNCTION,
    //     onDone: NULL_FUNCTION
    // });

    const changeTheme = () => {
        // muiTheme.palette.type = 'light';
        console.log("light");
        toggleDarkTheme();
    };

    function createTagDescriptor(tag: string, count: number): TagDescriptor {
        return {
            id: tag,
            label: tag,
            count,
            members: []
        };
    }

    const tagDescriptors: ReadonlyArray<TagDescriptor> = [
        createTagDescriptor('hello', 101),
        createTagDescriptor('world', 101),
    ];

    const root = TagNodes.createTagsRoot(tagDescriptors);

    interface IProps {
        readonly value: string;
    }

    async function provider() {
        return new Promise<IProps>(resolve => {
            setTimeout(() => {
                resolve({value: 'hello'});
            }, 1000);
        });
    }

    const Foo = (props: IProps) => {
        return (
            <div>
                {props.value}
            </div>
        );
    }

    const CompA = () => {
        useEffect(() => console.log("A"));

        return (
            <>
                <LinearProgress style={{
                                    position: 'absolute',
                                    left: 0,
                                    top: 0,
                                    height: 1,
                                    width: '100%'
                                }}/>
                <div>A</div>
            </>
        );
    }

    const CompB = () => {
        useEffect(() => console.log("B"));
        return <div>B</div>;
    }

    const CompC = () => {
        useEffect(() => console.log("C"));
        return <div>C</div>;
    }

    // const ComponentProgressLoader =

    return (
        <MUIAppRoot>

            <CompA/>
            <CompB/>
            <CompC/>

            {/*<CloudSyncConfiguredDialog/>*/}

            {/*red500: {red[500]} <br/>*/}

            {/*red500 darken: {darken(hexToRgb(red[500]), 0.2)} <br/>*/}

            {/*test: {darken('rgb(250, 240, 230)')} <br/>*/}

            {/*<ColorButton color={red[500]}>*/}
            {/*    this is a button*/}
            {/*</ColorButton>*/}

            {/*<ReviewerDemo/>*/}

            {/*<Paper>*/}

            {/*    asdfasdf*/}
            {/*</Paper>*/}
        </MUIAppRoot>
    );

    // return (
    //     // <GlobalHotKeys
    //     //     allowChanges={true}
    //     //     keyMap={globalKeyMap}>
    //
    //         <MUIAppRoot>
    //
    //             {/*<MUITreeView root={root}/>*/}
    //
    //             {/*<MyContextStoreComponent/>*/}
    //
    //             {/*<HookStateDemo/>*/}
    //             {/*<ObservableStoreDemo/>*/}
    //             {/*<ObservableStoreDemo2/>*/}
    //             {/*<MUITreeViewDemo/>*/}
    //             {/*<ComponentCacheDemo/>*/}
    //             {/*<TagAutocompleteDemo/>*/}
    //
    //             {/*<MUIContextMenuDemo/>*/}
    //
    //             {/*<ReviewerDemo/>*/}
    //
    //             {/*<UseAsyncWithCallbacksDemo/>*/}
    //
    //             <Loading/>
    //
    //             {/*<ContextMemoTest/>*/}
    //             {/*<SharedIntermediateContextTest/>*/}
    //             {/*<FadeDemo/>*/}
    //
    //             {/*<MUIHoverContextDemo/>*/}
    //
    //             {/*<MUIGridLayoutTest/>*/}
    //
    //             {/*<UserAvatar photoURL="https://lh5.googleusercontent.com/-BldJH1bae3o/AAAAAAAAAAI/AAAAAAAAADY/Di36-YNrKqk/photo.jpg"*/}
    //             {/*            displayName="Kevin Burton"*/}
    //             {/*            size="small"/>*/}
    //
    //             {/*<UserAvatar photoURL="https://lh5.googleusercontent.com/-BldJH1bae3o/AAAAAAAAAAI/AAAAAAAAADY/Di36-YNrKqk/photo.jpg"*/}
    //             {/*            displayName="Kevin Burton"*/}
    //             {/*            size="large"/>*/}
    //
    //             {/*<UserAvatar photoURL="https://lh5.googleusercontent.com/-BldJH1bae3o/AAAAAAAAAAI/AAAAAAAAADY/Di36-YNrKqk/photo.jpg"*/}
    //             {/*            displayName="Kevin Burton"*/}
    //             {/*            style={{*/}
    //             {/*                width: '150px',*/}
    //             {/*                height: '150px'*/}
    //             {/*            }}/>*/}
    //
    //             {/*<AccountControl userInfo={{*/}
    //             {/*    photoURL: "https://lh5.googleusercontent.com/-BldJH1bae3o/AAAAAAAAAAI/AAAAAAAAADY/Di36-YNrKqk/photo.jpg",*/}
    //             {/*    displayName: "Kevin Burton",*/}
    //             {/*    email: 'foo@example.com',*/}
    //             {/*    subscription: {*/}
    //             {/*        plan: 'gold',*/}
    //             {/*        interval: 'month'*/}
    //             {/*    }*/}
    //             {/*}} onLogout={NULL_FUNCTION}/>*/}
    //
    //             {/*<Button onClick={() => changeTheme()}>Go Light mode</Button>*/}
    //
    //             {/*<Container component="main" maxWidth={false} disableGutters>*/}
    //                 {/*<ReactVirtualizedTable/>*/}
    //
    //                 {/*<Grid*/}
    //                 {/*      container*/}
    //                 {/*      spacing={1}*/}
    //                 {/*      direction="row"*/}
    //                 {/*      alignItems="center"*/}
    //                 {/*>*/}
    //                 {/*    <Grid item>*/}
    //                 {/*        <Chip label="hello"/>*/}
    //                 {/*    </Grid>*/}
    //
    //
    //                 {/*    <Grid item>*/}
    //                 {/*        <Chip label="world"/>*/}
    //                 {/*    </Grid>*/}
    //
    //                 {/*</Grid>*/}
    //
    //                 {/*<MUITreeView/>*/}
    //
    //                 {/*<DialogDemo/>*/}
    //
    //                 {/*<Box m={1}>*/}
    //                 {/*    <AutocompleteTags/>*/}
    //                 {/*</Box>*/}
    //
    //                 {/*<MUICreatableAutocomplete label="tags bro"*/}
    //                 {/*                          options={tagOptions}*/}
    //                 {/*                          createOption={MUITagInputControls.createOption}*/}
    //                 {/*                          relatedOptionsCalculator={relatedOptionsCalculator}*/}
    //                 {/*                          onChange={NULL_FUNCTION}/>*/}
    //
    //             {/*<LinearProgress value={50} variant="determinate"/>*/}
    //
    //             {/*<Snackbar*/}
    //             {/*        anchorOrigin={{*/}
    //             {/*            vertical: 'bottom',*/}
    //             {/*            horizontal: 'left',*/}
    //             {/*        }}*/}
    //             {/*        open={true}*/}
    //             {/*        autoHideDuration={5000}*/}
    //             {/*        // onClose={handleClose}*/}
    //             {/*        // message="Note archived"*/}
    //             {/*        // action={*/}
    //             {/*        //     <React.Fragment>*/}
    //             {/*        //         /!*<Button color="secondary" size="small" >*!/*/}
    //             {/*        //         /!*    UNDO*!/*/}
    //             {/*        //         /!*</Button>*!/*/}
    //             {/*        //         /!*<IconButton size="small" aria-label="close" color="inherit" >*!/*/}
    //             {/*        //         /!*    <CloseIcon fontSize="small" />*!/*/}
    //             {/*        //         /!*</IconButton>*!/*/}
    //             {/*        //*/}
    //             {/*        //     </React.Fragment>*/}
    //             {/*        // }*/}
    //             {/*    >*/}
    //             {/*        /!*<Alert onClose={NULL_FUNCTION} severity="success">*!/*/}
    //             {/*        /!*    This is a success message!*!/*/}
    //             {/*        /!*</Alert>*!/*/}
    //
    //             {/*        /!*<SnackbarContent message={<LinearProgress value={50} variant="determinate"/>}/>*!/*/}
    //             {/*    <SnackbarContent message={<progress max={100} value={50}></progress>}/>*/}
    //
    //             {/*    </Snackbar>*/}
    //
    //                 {/*<AutocompleteDialog label="tags bro"*/}
    //                 {/*                    options={tagOptions}*/}
    //                 {/*                    createOption={MUITagInputControls.createOption}*/}
    //                 {/*                    relatedOptionsCalculator={relatedOptionsCalculator}*/}
    //                 {/*                    onChange={NULL_FUNCTION}*/}
    //                 {/*                    onCancel={NULL_FUNCTION}*/}
    //                 {/*                    onDone={NULL_FUNCTION}/>*/}
    //
    //                 {/*<MyResponsivePie/>*/}
    //
    //
    //                 {/*<OutlinedInput startAdornment={*/}
    //                 {/*    <InputAdornment position="start">*/}
    //                 {/*        <SearchIcon />*/}
    //                 {/*    </InputAdornment>*/}
    //                 {/*}*/}
    //                 {/*               type="search"/>*/}
    //
    //                 {/*<br/>*/}
    //                 {/*<br/>                   <br/>*/}
    //                 {/*<br/>*/}
    //
    //
    //                 {/*<MUISearchBox2 placeholder="This is a placeholder"*/}
    //                 {/*               onChange={NULL_FUNCTION}/>*/}
    //
    //                 {/*<MUIToggleButton label="test"*/}
    //                 {/*                 size="small"*/}
    //                 {/*                 onChange={NULL_FUNCTION}/>*/}
    //
    //                 {/*/!*<div style={{margin: '5px'}}>*!/*/}
    //                 {/*<MUISearchBox onChange={NULL_FUNCTION}/>*/}
    //
    //                 {/*<br/>*/}
    //                 {/*<br/>*/}
    //
    //                 {/*<IconButton size={'small'}>*/}
    //                 {/*    <CloseIcon/>*/}
    //                 {/*</IconButton>*/}
    //
    //                 {/*<br/>*/}
    //                 {/*<br/>*/}
    //
    //                 {/*<IconButton size={'medium'}>*/}
    //                 {/*    <CloseIcon/>*/}
    //                 {/*</IconButton>*/}
    //
    //             {/*<Paper variant="outlined">*/}
    //             {/*        hello world*/}
    //             {/*    </Paper>*/}
    //
    //             {/*    /!*<MUIHelpMenu/>*!/*/}
    //
    //
    //             {/*<MUIPaperToolbar borderTop*/}
    //             {/*                 borderBottom>*/}
    //             {/*    <ExampleDropdownMenu/>*/}
    //             {/*</MUIPaperToolbar>*/}
    //
    //             {/*    asdf*/}
    //
    //             {/*asdfasfda*/}
    //
    //             {/*asdf*/}
    //
    //             {/*<Tooltip title="hello world this is a long tooltip">*/}
    //             {/*    <Button>help</Button>*/}
    //             {/*</Tooltip>*/}
    //             {/*<br/>*/}
    //
    //             {/*adsfadsfasdf asdfasdf asdfasdf asdfa sfasdf<br/>*/}
    //             {/*adsfadsfasdf asdfasdf asdfasdf asdfa sfasdf<br/>*/}
    //             {/*adsfadsfasdf asdfasdf asdfasdf asdfa sfasdf<br/>*/}
    //             {/*adsfadsfasdf asdfasdf asdfasdf asdfa sfasdf<br/>*/}
    //             {/*adsfadsfasdf asdfasdf asdfasdf asdfa sfasdf<br/>*/}
    //             {/*adsfadsfasdf asdfasdf asdfasdf asdfa sfasdf<br/>*/}
    //             {/*adsfadsfasdf asdfasdf asdfasdf asdfa sfasdf<br/>*/}
    //             {/*adsfadsfasdf asdfasdf asdfasdf asdfa sfasdf<br/>*/}
    //             {/*adsfadsfasdf asdfasdf asdfasdf asdfa sfasdf<br/>*/}
    //             {/*adsfadsfasdf asdfasdf asdfasdf asdfa sfasdf<br/>*/}
    //             {/*adsfadsfasdf asdfasdf asdfasdf asdfa sfasdf<br/>*/}
    //             {/*adsfadsfasdf asdfasdf asdfasdf asdfa sfasdf<br/>*/}
    //
    //             {/*<MUIDialogController render={dialogs => (*/}
    //
    //             {/*    <Button onClick={() => dialogs.confirm({*/}
    //             {/*                         title: 'are you sure?',*/}
    //             {/*                         subtitle: 'because you better be',*/}
    //             {/*                         onAccept: NULL_FUNCTION,*/}
    //             {/*                         onCancel: NULL_FUNCTION*/}
    //             {/*                    })}>*/}
    //             {/*        Click me*/}
    //             {/*    </Button>*/}
    //
    //             {/*)}/>*/}
    //
    //             {/*<div style={{marginLeft: '250px'}}>*/}
    //             {/*    <MUIDropdownMenu button={{*/}
    //             {/*                        icon: <SettingsIcon/>*/}
    //             {/*                     }}>*/}
    //             {/*        <div>*/}
    //             {/*            <MenuItem >Profile</MenuItem>*/}
    //             {/*            <MenuItem >My account</MenuItem>*/}
    //             {/*            <MenuItem >Logout</MenuItem>*/}
    //             {/*        </div>*/}
    //             {/*    </MUIDropdownMenu>*/}
    //             {/*</div>*/}
    //
    //                 {/*</div>*/}
    //
    //
    //                 {/*<TextField id="standard-search" type="search" InputProps={{*/}
    //                 {/*    startAdornment: (*/}
    //                 {/*        <FlagIcon/>*/}
    //                 {/*    )*/}
    //                 {/*}}/>*/}
    //
    //                 {/*<TagAutocompleteDemo/>*/}
    //                 {/*<AlertDialogDemo/>*/}
    //                 {/*<PromptDialogDemo/>*/}
    //
    //                 {/*<InputValidationErrorSnackbar message="This is a bad message bro"/>*/}
    //
    //                 {/*<MUITagInputControl availableTags={tags}/>*/}
    //
    //                 {/*<Snackbar open={true} autoHideDuration={1000} onClose={NULL_FUNCTION}>*/}
    //                 {/*    <Alert severity="error" onClose={NULL_FUNCTION}>*/}
    //                 {/*        This is a very very bad error message.*/}
    //                 {/*    </Alert>*/}
    //                 {/*</Snackbar>*/}
    //
    //                 {/*<DocumentRepositoryTable data={MockRepoDocInfos.create()}*/}
    //                 {/*                         selected={[0, 1]}*/}
    //                 {/*                         selectRow={NULL_FUNCTION}*/}
    //                 {/*                         onOpen={() => console.log('onOpen')}*/}
    //                 {/*                         onShowFile={() => console.log('onShowFile')}*/}
    //                 {/*                         onRename={() => console.log('onRename')}*/}
    //                 {/*                         onCopyOriginalURL={() => console.log('onCopyOriginalURL')}*/}
    //                 {/*                         onCopyFilePath={() => console.log('onCopyFilePath')}*/}
    //                 {/*                         onDelete={() => console.log('FIXME: onDelete ' + Date.now())}*/}
    //                 {/*                         onCopyDocumentID={() => console.log('onCopyDocumentID')}*/}
    //                 {/*                         onLoadDoc={(repoDocInfo) => console.log('onLoadDoc: ', repoDocInfo)}*/}
    //                 {/*                         onFlagged={() => console.log('onFlagged')}*/}
    //                 {/*                         onArchived={() => console.log('onArchived')}*/}
    //                 {/*/>*/}
    //
    //                 {/*<Foo/>*/}
    //                 {/*<Foo/>*/}
    //                 {/*<Foo/>*/}
    //
    //                 {/*<div style={{display: 'flex'}}>*/}
    //                 {/*    <div style={{flexGrow: 1}}>*/}
    //
    //                 {/*    </div>*/}
    //                 {/*    <div>*/}
    //                 {/*        <MUIDocDropdownButton/>*/}
    //                 {/*    </div>*/}
    //                 {/*</div>*/}
    //
    //                 {/*<DocButtonsDemo/>*/}
    //
    //                 {/*<Button variant="contained" color="primary" onClick={() => console.log('hello')}>*/}
    //                 {/*    Hello World*/}
    //                 {/*</Button>*/}
    //
    //                 {/*<Tags/>*/}
    //
    //                 {/*<ReactVirtualizedTable/>*/}
    //
    //                 {/*<TreeControl/>*/}
    //                 {/*<TabsDemo/>*/}
    //                 {/*<IconsDemo/>*/}
    //
    //                 {/*<DropdownMenuDemo/>*/}
    //
    //             {/*</Container>*/}
    //         </MUIAppRoot>
    //     // </GlobalHotKeys>
    // );
}

