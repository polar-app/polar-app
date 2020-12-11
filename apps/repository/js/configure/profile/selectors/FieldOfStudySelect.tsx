import * as React from "react";
import {
    FieldOfStudy,
    fieldsOfStudy,
    toFieldOfStudy
} from "polar-shared/src/util/FieldOfStudies";
import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import {Arrays} from "polar-shared/src/util/Arrays";
import FormControl from "@material-ui/core/FormControl";

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


export const FieldOfStudySelect = React.memo((props: IProps) => {

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
        <FormControl variant="outlined">
            <Select value={undefined}
                    placeholder="Select field of study"
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
        </FormControl>
    );

});

