import * as React from "react";
import CreatableSelect from 'react-select/creatable';
import {toIdentifier} from "polar-shared/src/util/Identifiers";

export interface IOption<T> {
    readonly value: T;
    readonly label: string;
}

// FIXME add more business occupations here not just academic ones
// FIXME send event when profile completed

export type OccupationType = 'academic' | 'business';

const academicOccupations = [
    "Student",
    "Researcher",
    "Professor",
    "Teacher",
    "Lecturer",
    "Librarian",
];

const businessOccupations = [
    "Software Engineer",
    "Mathematician",
    "Web Designer",
];

export interface AcademicOccupation {
    readonly id: string;
    readonly type: 'academic';
    readonly name: string;
}

export interface BusinessOccupation {
    readonly id: string;
    readonly type: 'business';
    readonly name: string;
}

export type Occupation = AcademicOccupation | BusinessOccupation;

class Occupations {

    public static academicFromName(name: string): AcademicOccupation {
        return {
            id: toIdentifier(name),
            type: 'academic',
            name
        };
    }

    public static businessFromName(name: string): BusinessOccupation {
        name = name.trim();
        return {
            id: toIdentifier(name),
            type: 'business',
            name
        };
    }

    // public static

}

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

    return (
        <CreatableSelect
            isClearable
            autoFocus
            placeholder={props.placeholder ?? "Select an occupation..."}
            options={options}
            onChange={(option => onSelect(option as RawOption))}
        />
    );
};

