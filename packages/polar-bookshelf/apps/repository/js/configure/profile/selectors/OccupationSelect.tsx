import * as React from "react";
import {
    academicOccupations,
    businessOccupations,
    Occupation,
    Occupations
} from "polar-shared/src/util/Occupations";

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


export const OccupationSelect = (props: IProps) => {

    type RawOption = IOption<Occupation> | string| null;

    const onSelect = (option: RawOption) => {

        if (option === null) {
            props.onSelect(undefined);
        } else if (typeof option === 'string') {
            props.onSelect(toOption(Occupations.businessFromName(option)));
        } else {
            props.onSelect(option);
        }

    };

    // return (
    //     <CreatableSelect
    //         isClearable
    //         autoFocus
    //         placeholder={props.placeholder ?? "Select an occupation..."}
    //         options={options}
    //         onChange={(option => onSelect(option as RawOption))}
    //     />
    // );
    return null;
};

