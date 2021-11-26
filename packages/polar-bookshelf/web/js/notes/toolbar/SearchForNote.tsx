import React from 'react';
import Autocomplete from "@material-ui/lab/Autocomplete"
import TextField from '@material-ui/core/TextField';
import {observer} from "mobx-react-lite"
import {useNoteLinkLoader} from "../NoteLinkLoader";
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import {useBlocksStore} from '../store/BlocksStore';
import {MUIDialog} from '../../ui/dialogs/MUIDialog';
import {MUICommandMenu} from '../../mui/command_menu/MUICommandMenu';
import {createStyles, IconButton, makeStyles, Tooltip} from '@material-ui/core';
import CloseIcon from '@material-ui/icons/Close';
import {useJumpToNoteKeyboardCommands} from "../JumpToNoteKeyboardCommand";
import {StandardIconButton} from "../../../../apps/repository/js/doc_repo/buttons/StandardIconButton";

export const SearchForNote: React.FC = observer(() => {

    const noteLinkLoader = useNoteLinkLoader();
    const blocksStore = useBlocksStore();

    const namedBlocks = blocksStore.namedBlockEntries;

    const [inputValue, setInputValue] = React.useState('');

    const namedBlockNames = React.useMemo(() => {
        return namedBlocks.map(({ label }) => label);
    }, [namedBlocks]);

    return (
        <Autocomplete
            size="medium"
            options={namedBlockNames}
            getOptionLabel={option => option}
            fullWidth
            inputValue={inputValue}
            blurOnSelect={true}
            onInputChange={(_, nextInputValue) => {
                setInputValue(nextInputValue);
            }}
            onChange={(_, value) => {
                if (value) {
                    noteLinkLoader(value);
                    setInputValue('');
                }
            }}
            renderInput={(params) => <TextField {...params}
                                                size="small"
                                                InputProps={{
                                                    ...params.InputProps,
                                                    style: {height: 38},
                                                    startAdornment: (
                                                        <InputAdornment position="end">
                                                            <SearchIcon/>
                                                        </InputAdornment>
                                                    ),
                                                }}
                                                placeholder="Find note by name... "
                                                variant="outlined" />}
        />
    );
});

const useSearchForNoteHandheldStyles = makeStyles((theme) =>
    createStyles({
        dialog: { fontSize: '1.3rem' },
        commandMenu: {
            margin: theme.spacing(1),
            minHeight: 'min(80vh, 500px)',
            maxHeight: 'min(80vh, 500px)',
        },
        closeButton: {
            position: 'absolute',
            top: theme.spacing(1),
            right: theme.spacing(1),
        },
    })
);

export const SearchForNoteHandheld: React.FC = observer(() => {
    const classes = useSearchForNoteHandheldStyles();
    const [active, setActive] = React.useState(false);

    const [commandsProvider, handleCommand] = useJumpToNoteKeyboardCommands();

    return (
        <>
            <Tooltip title="Search">
                <StandardIconButton tooltip="Search for note"
                                    size="small"
                                    onClick={() => setActive(true)}>
                    <SearchIcon />
                </StandardIconButton>
            </Tooltip>
            <MUIDialog fullWidth
                       open={active}
                       className={classes.dialog}>

                <IconButton size="small" className={classes.closeButton} onClick={() => setActive(false)}>
                    <CloseIcon />
                </IconButton>

                <MUICommandMenu onCommand={handleCommand}
                                title="Search for note"
                                className={classes.commandMenu}
                                onClose={() => setActive(false)}
                                commandsProvider={commandsProvider}/>

            </MUIDialog>
        </>
    );
});
