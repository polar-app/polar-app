import React from 'react';
import Autocomplete from "@material-ui/lab/Autocomplete"
import TextField from '@material-ui/core/TextField';
import {observer} from "mobx-react-lite"
import {useNoteLinkLoader} from "../NoteLinkLoader";
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import {NamedContent} from '../store/BlocksStore';
import {MUIDialog} from '../../ui/dialogs/MUIDialog';
import {ICommand, MUICommandMenu} from '../../mui/command_menu/MUICommandMenu';
import {BlockTextContentUtils, useNamedBlocks} from '../NoteUtils';
import {createStyles, IconButton, makeStyles, Tooltip} from '@material-ui/core';
import {Block} from "../store/Block";
import CloseIcon from '@material-ui/icons/Close';
import {IBlock, INamedContent} from "polar-blocks/src/blocks/IBlock";

export const SearchForNote: React.FC = observer(() => {

    const noteLinkLoader = useNoteLinkLoader();

    const namedBlocks = useNamedBlocks({sort: true});

    const [inputValue, setInputValue] = React.useState('');

    const toLabel = React.useCallback((block: IBlock<INamedContent>): string => {
        switch (block.content.type) {
            case "name":
            case "date":
                return block.content.data;
            case "document":
                return block.content.docInfo.title || 'Untitled'
        }
    }, []);

    const sortedNamedBlocks = React.useMemo(() => {
        return namedBlocks.map(toLabel);
    }, [namedBlocks, toLabel]);

    return (
        <Autocomplete
            size="medium"
            options={sortedNamedBlocks}
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

export const SearchForNoteHandheld: React.FC = () => {
    const classes = useSearchForNoteHandheldStyles();
    const namedBlocks = useNamedBlocks({ sort: true });
    const noteLinkLoader = useNoteLinkLoader();

    const commandsProvider = React.useCallback(() => {
        const toCommand = (block: Readonly<Block<NamedContent>>) => {
            const text = BlockTextContentUtils.getTextContentMarkdown(block.content);
            return { text, id: text };
        };
        return namedBlocks.map(toCommand);
    }, [namedBlocks]);

    const [active, setActive] = React.useState(false);

    const handleCommand = React.useCallback((command: ICommand) =>
        noteLinkLoader(command.id), [noteLinkLoader]);

    return (
        <>
            <Tooltip title="Search">
                <IconButton size="small" onClick={() => setActive(true)}>
                    <SearchIcon />
                </IconButton>
            </Tooltip>
            <MUIDialog fullWidth open={active} className={classes.dialog}>
                <IconButton size="small" className={classes.closeButton} onClick={() => setActive(false)}>
                    <CloseIcon />
                </IconButton>
                <MUICommandMenu onCommand={handleCommand}
                                className={classes.commandMenu}
                                title="Search for note"
                                onClose={() => setActive(false)}
                                commandsProvider={commandsProvider}/>

            </MUIDialog>
        </>
    );
};
