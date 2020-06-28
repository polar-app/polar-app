import * as React from "react";
import CreatableSelect from 'react-select/creatable';
import {
    FieldOfStudy,
    fieldsOfStudy,
    toFieldOfStudy
} from "polar-shared/src/util/FieldOfStudies";

export interface IOption<T> {
    readonly value: T;
    readonly label: string;
}


function toOption(fieldOfStudy: FieldOfStudy): IOption<FieldOfStudy> {
    return {
        value: fieldOfStudy,
        label: fieldOfStudy.name
    };
}

const options: ReadonlyArray<IOption<FieldOfStudy>>
    = fieldsOfStudy.map(toFieldOfStudy)
                   .map(toOption);

interface IProps {

    readonly placeholder?: string;

    readonly onSelect: (option: IOption<FieldOfStudy> | undefined) => void;
}


export const FieldOfStudySelect = (props: IProps) => {

    type RawOption = IOption<FieldOfStudy> | string | null;


    const onSelect = (option: RawOption) => {

        if (option === null) {
            props.onSelect(undefined);
        } else if (typeof option === 'string') {
            props.onSelect(toOption(toFieldOfStudy(option)));
        } else {
            props.onSelect(option);
        }

    };

    return (
        <CreatableSelect
            isClearable
            autoFocus
            placeholder={props.placeholder ?? "Select a field of study..."}
            options={options}
            onChange={(option => onSelect(option as RawOption))}
            // onKeyDown={event => props.onKeyDown(event)}
            // onChange={(selectedOptions) => props.handleChange(selectedOptions as TagOption[])}
            // value={props.pendingTagOptions}
            // defaultValue={props.pendingTagOptions}
        />
    );
};

