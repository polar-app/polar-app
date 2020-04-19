/* eslint-disable no-use-before-define */
import React, {useState} from 'react';
import Autocomplete, {
    AutocompleteChangeDetails,
    AutocompleteChangeReason, createFilterOptions
} from '@material-ui/lab/Autocomplete';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Popper from "@material-ui/core/Popper";
import {Tag} from "polar-shared/src/tags/Tags";
import {isPresent} from "polar-shared/src/Preconditions";
import { arrayStream } from 'polar-shared/src/util/ArrayStreams';

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: 500,
            // marginTop: theme.spacing(1),
        },
    }),
);

interface CreateAutocompleteOption {
    readonly inputValue: string;
    readonly label: string;
}

export interface AutocompleteOption<T> {

    /**
     * A unique internal ID to prevent duplicates being selected.
     */
    readonly id: string;

    /**
     * A label to show in the UI.
     */
    readonly label: string;

    /**
     * The actual value which can be a more complex object.
     */
    readonly value: T;

}

type InternalAutocompleteOption<T> = CreateAutocompleteOption | AutocompleteOption<T>;

interface AutocompleteOptionMap<T> {
    [key: string]: AutocompleteOption<T>;
}

function isCreateAutocompleteOption<T>(option: InternalAutocompleteOption<T>): option is CreateAutocompleteOption {
    return isPresent((option as any).inputValue);
}

interface IProps<T> {
    readonly label: string;
    readonly options: ReadonlyArray<AutocompleteOption<T>>;
    readonly defaultOptions?: ReadonlyArray<AutocompleteOption<T>>;

    readonly placeholder?: string

    /**
     * Used when converting an option entered by the user to an object with
     * a label.
     */
    readonly createOption: (label: string) => AutocompleteOption<T>;

}

export default function MUICreatableAutocomplete<T>(props: IProps<T>) {

    const classes = useStyles();

    const [values, setValues] = useState<AutocompleteOptionMap<T>>({});

    const handleChange = (event: React.ChangeEvent<{}>,
                          newValues: InternalAutocompleteOption<T> | null | InternalAutocompleteOption<T>[],
                          reason: AutocompleteChangeReason,
                          details: AutocompleteChangeDetails<InternalAutocompleteOption<T>> | undefined) => {

        const convertToTagMap = (tagOptions: ReadonlyArray<InternalAutocompleteOption<T>>): AutocompleteOptionMap<T> => {

            const toAutocompleteOption = (option: InternalAutocompleteOption<T>): AutocompleteOption<T> => {
                if (isCreateAutocompleteOption(option)) {
                    return props.createOption(option.inputValue);
                } else {
                    return option;
                }
            };

            return arrayStream(tagOptions)
                .map(toAutocompleteOption)
                .toMap(current => current.id);

        };

        if (newValues === null) {
            setValues({});
            return;
        }

        if (Array.isArray(newValues)) {
            setValues(convertToTagMap(newValues));
            return;
        }

        setValues(convertToTagMap([newValues]));

    };

    const filter = createFilterOptions<InternalAutocompleteOption<T>>();

    const options: ReadonlyArray<InternalAutocompleteOption<T>> = props.options;
    const defaultOptions = props.defaultOptions || [];

    // FIXME: autofocus
    // FIXME: onChange callback for selected items
    // FIXME: set default values

    return (
        <div className={classes.root}>
            <Autocomplete
                multiple
                // freeSolo
                defaultValue={[...defaultOptions]}
                options={[...options]}
                getOptionLabel={(option) => option.label}
                onChange={(event, value, reason, details) => handleChange(event, value, reason, details)}
                filterSelectedOptions
                filterOptions={(options, params) => {

                    const filtered = filter(options, params) as InternalAutocompleteOption<T>[];

                    if (params.inputValue !== '') {
                        filtered.push({
                            inputValue: params.inputValue,
                            label: `Create: "${params.inputValue}"`
                        });
                    }

                    return filtered;

                }}
                // noOptionsText={<Button onClick={() => handleOptionCreated()}>Create "{value}"</Button>}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label={props.label}
                        placeholder={props.placeholder || ''}
                    />
                )}
            />

        </div>
    );
}
