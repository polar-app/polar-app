import * as React from "react";
import {
    FieldOfStudy,
    fieldsOfStudy,
    toFieldOfStudy
} from "polar-shared/src/util/FieldOfStudies";
import Autocomplete from "@material-ui/lab/Autocomplete";
import TextField from "@material-ui/core/TextField";

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


export const FieldOfStudySelect = React.memo(function FieldOfStudySelect(props: IProps) {

    const handleChange = React.useCallback((event: React.ChangeEvent<{}>, option: IOption<FieldOfStudy> | null) => {

        if (option === null || option === undefined) {
            props.onSelect(undefined);
        } else {
            props.onSelect(option);
        }

    }, [props]);

    return (
        <Autocomplete
            style={{ flexGrow: 1 }}
            options={[...options]}
            onChange={handleChange}
            getOptionLabel={(option) => option.label}
            renderInput={(params) => <TextField {...params} label="... who studies" variant="outlined" />}
        />
    );

});

