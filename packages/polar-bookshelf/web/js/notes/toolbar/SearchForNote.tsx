import React from 'react';
import Autocomplete from "@material-ui/lab/Autocomplete"
import TextField from '@material-ui/core/TextField';
import {observer} from "mobx-react-lite"
import {useNoteLinkLoader} from "../NoteLinkLoader";
import InputAdornment from '@material-ui/core/InputAdornment';
import SearchIcon from '@material-ui/icons/Search';
import {useBlocksStore} from '../store/BlocksStore';

export const SearchForNote = observer(() => {

    const blocksStore = useBlocksStore();
    const noteLinkLoader = useNoteLinkLoader();

    const namedBlocks = blocksStore.getNamedBlocks();

    const [inputValue, setInputValue] = React.useState('');

    return (
        <Autocomplete
            size="medium"
            options={[...namedBlocks]}
            getOptionLabel={(option) => option}
            inputValue={inputValue}
            value={''}
            fullWidth
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
