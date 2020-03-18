import * as React from "react";
import Select from "react-select";
import {nullToUndefined} from "polar-shared/src/util/Nullable";
import {toIdentifier} from "polar-shared/src/util/Identifiers";

export interface IOption<T> {
    readonly value: T;
    readonly label: string;
}

export type OccupationType = 'academic' | 'business';

const academicOccupations = [
    "Lecturer",
    "Lecturer: Senior Lecturer",
    "Librarian",
    "Other",
    "Professor",
    "Professor: Associate Professor",
    "Researcher",
    "Student: Bachelor",
    "Student: Doctoral Student",
    "Student: Master",
    "Student: Ph. D. Student",
    "Student: Postgraduate",
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
    /**
     *
     */
    readonly onSelect: (option: IOption<Occupation> | undefined) => void;
}


export const OccupationSelect = (props: IProps) => {

    type RawOption = IOption<Occupation> | null;

    return (
        <Select
            isClearable
            autoFocus
            placeholder="Select an occupation..."
            options={options}
            onChange={(option => props.onSelect(nullToUndefined(option as RawOption)))}
        />
    );
};

