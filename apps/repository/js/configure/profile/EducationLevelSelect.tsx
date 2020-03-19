import * as React from "react";
import Select from "react-select";
import {nullToUndefined} from "polar-shared/src/util/Nullable";
import {toIdentifier} from "polar-shared/src/util/Identifiers";

export interface IOption<T> {
    readonly value: T;
    readonly label: string;
}

export interface EducationLevel {
    readonly id: string;
    readonly name: string;
}

const educationLevels: ReadonlyArray<EducationLevel> = [
    {
        id: 'highschool',
        name: "High School"
    },
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

function toOption(educationLevel: EducationLevel): IOption<EducationLevel> {
    return {
        value: educationLevel,
        label: educationLevel.name
    };
}

const options: ReadonlyArray<IOption<EducationLevel>>
    = educationLevels.map(toOption);

interface IProps {

    readonly placeholder?: string;

    readonly onSelect: (option: IOption<EducationLevel> | undefined) => void;
}


export const EducationLevelSelect = (props: IProps) => {

    type RawOption = IOption<EducationLevel> | null;

    return (
        <Select
            isClearable
            autoFocus
            placeholder={props.placeholder ?? "Select a level of education..."}
            options={options}
            onChange={(option => props.onSelect(nullToUndefined(option as RawOption)))}
        />
    );
};

