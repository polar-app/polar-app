import * as React from "react";
import {
    academicOccupations,
    businessOccupations,
    Occupation,
    Occupations
} from "polar-shared/src/util/Occupations";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { Arrays } from "polar-shared/src/util/Arrays";
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/lab/Autocomplete";

export interface IOption<T> {
    readonly value: T;
    readonly label: string;
}

// FIXME add more business occupations here not just academic ones

function toOption(occupation: Occupation): IOption<Occupation> {
    return {
        value: occupation,
        label: occupation.name
    };
}

const academicOptions = academicOccupations.map(Occupations.academicFromName)
                                           .map(toOption);

const businessOptions = businessOccupations.map(Occupations.businessFromName)
                                           .map(toOption);

const options = [...academicOptions, ...businessOptions];

interface IProps {

    readonly placeholder?: string;

    readonly onSelect: (option: IOption<Occupation> | undefined) => void;
}


export const OccupationSelect = React.memo((props: IProps) => {

    const handleChange = React.useCallback((event: React.ChangeEvent<{}>, option: IOption<Occupation> | null) => {

        if (option === null || option === undefined) {
            props.onSelect(undefined);
        } else {
            props.onSelect(option);
        }

    }, [props]);

    return (
        <Autocomplete
            options={[...options]}
            onChange={handleChange}
            getOptionLabel={(option) => option.label}
            style={{ flexGrow: 1 }}
            renderInput={(params) => <TextField {...params} label="I am a ... " variant="outlined" />}
        />
    );

});