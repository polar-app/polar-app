import * as React from "react";
import {
    EducationLevel,
    educationLevels
} from "polar-shared/src/util/EducationLevels";

export interface IOption<T> {
    readonly value: T;
    readonly label: string;
}

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

    // return (
    //     <Select
    //         isClearable
    //         autoFocus
    //         placeholder={props.placeholder ?? "Select a level of education..."}
    //         options={options}
    //         onChange={(option => props.onSelect(nullToUndefined(option as RawOption)))}
    //     />
    // );

    return null;

};

