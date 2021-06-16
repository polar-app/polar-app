import React from 'react';
import Autocomplete from "@material-ui/lab/Autocomplete"
import TextField from '@material-ui/core/TextField';
import {useBlocksStore} from "../store/BlocksStore";
import { observer } from "mobx-react-lite"
import {useNoteLinkLoader} from "../NoteLinkLoader";
import InputAdornment from '@material-ui/core/InputAdornment';
import Box from '@material-ui/core/Box';
import SearchIcon from '@material-ui/icons/Search';
import {createStyles, makeStyles} from '@material-ui/core';

const useStyles = makeStyles(() =>
    createStyles({
        root: {
            width: 300,
            margin: 5,
        },
    }),
);

export const SearchForNote = observer(() => {

    const classes = useStyles();
    const blocksStore = useBlocksStore();
    const noteLinkLoader = useNoteLinkLoader();

    const namedBlocks = blocksStore.getNamedBlocks();

    const [inputValue, setInputValue] = React.useState('');

    return (
        <div className={classes.root}>
            <Autocomplete
                size="medium"
                options={[...namedBlocks]}
                getOptionLabel={(option) => option}
                inputValue={inputValue}
                value={''}
                fullWidth
                blurOnSelect={true}
                onInputChange={(event, nextInputValue, reason) => {
                    setInputValue(nextInputValue);
                }}
                onChange={(event, value, reason, details) => {
                    if (value) {
                        noteLinkLoader(value);
                        setInputValue('');
                    }
                }}
                renderInput={(params) => <TextField {...params}
                                                    InputProps={{
                                                        ...params.InputProps,
                                                        startAdornment: (
                                                            <InputAdornment position="start">
                                                                <Box color="text.secondary">
                                                                    <SearchIcon/>
                                                                </Box>
                                                            </InputAdornment>
                                                        ),
                                                    }}
                                                    placeholder="Find note by name... "
                                                    variant="standard" />}
            />
        </div>
    );
});
