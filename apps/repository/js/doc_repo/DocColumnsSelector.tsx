import * as React from 'react';
import FormControl from '@material-ui/core/FormControl';
import {IDocInfo} from "polar-shared/src/metadata/IDocInfo";
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

interface IProps {
    readonly columns: ReadonlyArray<keyof IDocInfo>
}

const names = ['foo', 'bar'];

export const DocColumnsSelector = () => {
    return (
        <FormControl>
            <Select
                multiple
                value={[]}
                onChange={NULL_FUNCTION}
                // input={<div />}
                // MenuProps={MenuProps}>
                >
                {names.map((name) => (
                    <MenuItem key={name} value={name}>
                        {name}
                    </MenuItem>
                ))}
            </Select>
        </FormControl>
    )
}