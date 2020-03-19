import * as React from "react";
import Select from "react-select";
import {nullToUndefined} from "polar-shared/src/util/Nullable";
import {toIdentifier} from "polar-shared/src/util/Identifiers";

export interface IOption<T> {
    readonly value: T;
    readonly label: string;
}

export interface UniversityLevel {
    readonly id: string;
    readonly name: string;
}

const universityLevels: ReadonlyArray<UniversityLevel> = [
    {
        id: 'bachelors',
        name: "Bachelors"
    },
    {
        id: "masters",
        name: "Masters"
    },
    {
        id: "doctorate",
        name: "Doctorate / PhD"
    },
    {
        id: "postdoctorate",
        name: "Postdoctorate"
    },
    {
        id: "other",
        name: "Other"
    },
];

function toOption(universityLevel: UniversityLevel): IOption<UniversityLevel> {
    return {
        value: universityLevel,
        label: universityLevel.name
    };
}

const options: ReadonlyArray<IOption<UniversityLevel>>
    = universityLevels.map(toOption);

interface IProps {

    readonly placeholder?: string;

    readonly onSelect: (option: IOption<UniversityLevel> | undefined) => void;
}


export const UniversityLevelSelect = (props: IProps) => {

    type RawOption = IOption<UniversityLevel> | null;

    return (
        <Select
            isClearable
            autoFocus
            placeholder={props.placeholder ?? "Select a degree..."}
            options={options}
            onChange={(option => props.onSelect(nullToUndefined(option as RawOption)))}
        />
    );
};

