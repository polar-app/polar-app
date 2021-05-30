import React from 'react';
import Autocomplete from "@material-ui/lab/Autocomplete"
import TextField from '@material-ui/core/TextField';
import {useBlocksStore} from "../store/BlocksStore";
import { observer } from "mobx-react-lite"
import { useHistory } from 'react-router-dom';


export const SearchForNote = observer(() => {

    const blocksStore = useBlocksStore();
    const history = useHistory();

    const namedNodes = blocksStore.getNamedNodes();

    return (
        <div>
            <Autocomplete
                options={[...namedNodes]}
                getOptionLabel={(option) => option}
                inputValue={''}
                value={''}
                blurOnSelect={true}
                style={{ width: 300 }}
                onInputChange={(event, nextInputValue, reason) => {
                }}
                onChange={(event, value, reason, details) => {
                    if (value) {
                        // TODO: I think there's a note jump component or
                        // something for this rather than using history directly
                        history.push(`/notes/${value}`);
                    }
                }}
                renderInput={(params) => <TextField {...params}
                                                    label="Find note by name... "
                                                    variant="standard" />}
            />
        </div>
    );
});
