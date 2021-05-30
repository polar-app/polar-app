import React from 'react';
import Autocomplete from "@material-ui/lab/Autocomplete"
import TextField from '@material-ui/core/TextField';
import {useBlocksStore} from "../store/BlocksStore";
import { observer } from "mobx-react-lite"
import {useNoteLinkLoader} from "../NoteLinkLoader";
import InputAdornment from '@material-ui/core/InputAdornment';
import Box from '@material-ui/core/Box';
import SearchIcon from '@material-ui/icons/Search';

export const SearchForNote = observer(() => {

    const blocksStore = useBlocksStore();
    const noteLinkLoader = useNoteLinkLoader();

    const namedNodes = blocksStore.getNamedNodes();

    const [inputValue, setInputValue] = React.useState('');

    return (
        <div>
            <Autocomplete
                size="medium"
                options={[...namedNodes]}
                getOptionLabel={(option) => option}
                inputValue={inputValue}
                value={''}
                blurOnSelect={true}
                style={{ width: 300 }}
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
                                                    style={{margin: '5px'}}
                                                    placeholder="Find note by name... "
                                                    variant="standard" />}
            />
        </div>
    );
});
