import * as React from "react";
import Select from "react-select";
import {nullToUndefined} from "polar-shared/src/util/Nullable";
import {toIdentifier} from "polar-shared/src/util/Identifiers";

export interface IOption<T> {
    readonly value: T;
    readonly label: string;
}

// FIXME add business occupations here not just academic ones
// FIXME prompt for their company URL / domain...
// FIXME event when profile completed

export type OccupationType = 'academic' | 'business';

const academicOccupations = [
    "Student",
    "Researcher",
    "Professor",
    "Lecturer",
    "Librarian",
    "Other",
];

export interface Occupation {
    readonly id: string;
    readonly type: OccupationType;
    readonly name: string;
}

class Occupations {
    public static convertFromAcademic(name: string): Occupation {
        return {
            id: toIdentifier(name),
            type: 'academic',
            name
        };
    }
}

function toOption(occupation: Occupation): IOption<Occupation> {
    return {
        value: occupation,
        label: occupation.name
    };
}

const options: ReadonlyArray<IOption<Occupation>>
    = academicOccupations.map(Occupations.convertFromAcademic)
                         .map(toOption);

interface IProps {

    readonly placeholder?: string;

    readonly onSelect: (option: IOption<Occupation> | undefined) => void;
}


export const OccupationSelect = (props: IProps) => {

    type RawOption = IOption<Occupation> | null;

    return (
        <Select
            isClearable
            autoFocus
            placeholder={props.placeholder ?? "Select an occupation..."}
            options={options}
            onChange={(option => props.onSelect(nullToUndefined(option as RawOption)))}
        />
    );
};

