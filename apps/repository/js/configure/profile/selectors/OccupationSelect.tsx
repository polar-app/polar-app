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

    const handleChange = React.useCallback((event: React.ChangeEvent<{ value: unknown }>) => {

        const selectedID = event.target.value as string;

        const option = Arrays.first(options.filter(current => current.value.id === selectedID));

        if (option === null || option === undefined) {
            props.onSelect(undefined);
        } else {
            props.onSelect(option);
        }

    }, [props]);

    return (
        <Select value={undefined}
                placeholder="Select occupation"
                style={{
                    minWidth: '300px'
                }}
                onChange={handleChange}>

            {options.map(current => (
                <MenuItem key={current.value.id}
                          value={current.value.id}>
                    {current.label}
                </MenuItem>
            ))}
        </Select>
    );

});