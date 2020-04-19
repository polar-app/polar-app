/* eslint-disable no-use-before-define */
import React, {useState} from 'react';
import Autocomplete, {
    AutocompleteChangeDetails,
    AutocompleteChangeReason, createFilterOptions, RenderInputParams
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

    readonly autoFocus?: boolean;

    /**
     * Used when converting an option entered by the user to an object with
     * a label.
     */
    readonly createOption: (label: string) => AutocompleteOption<T>;

    readonly onChange: (selected: ReadonlyArray<T>) => void;

}

interface IState<T> {
    readonly values: ReadonlyArray<InternalAutocompleteOption<T>>;
    readonly options: ReadonlyArray<AutocompleteOption<T>>;
}

export default function MUICreatableAutocomplete<T>(props: IProps<T>) {

    const classes = useStyles();

    const [state, setState] = useState<IState<T>>({
        values: props.defaultOptions || [],
        options: props.options
    });

    const handleChange = (event: React.ChangeEvent<{}>,
                          newValues: InternalAutocompleteOption<T> | null | InternalAutocompleteOption<T>[],
                          reason: AutocompleteChangeReason,
                          details: AutocompleteChangeDetails<InternalAutocompleteOption<T>> | undefined) => {

        const convertToAutocompleteOptions = (rawOptions: ReadonlyArray<InternalAutocompleteOption<T>>): ReadonlyArray<AutocompleteOption<T>> => {

            const toAutocompleteOption = (option: InternalAutocompleteOption<T>): AutocompleteOption<T> => {
                if (isCreateAutocompleteOption(option)) {
                    return props.createOption(option.inputValue);
                } else {
                    return option;
                }
            };

            return arrayStream(rawOptions)
                .map(toAutocompleteOption)
                .collect();

        };

        // make sure any new values are in the options map because MUI gets mad
        // if there's a value thats not in the options.
        const convertToOptions = (newValues: ReadonlyArray<AutocompleteOption<T>>) => {

            const optionsMap = arrayStream(state.options)
                .toMap(current => current.id);

            // force the new options into the map

            for (const newValue of newValues) {
                optionsMap[newValue.id] = newValue;
            }

            return Object.values(optionsMap);

        };

        if (newValues === null) {

            setState({
                ...state,
                values: []
            });

            return;

        }

        const toArray = () => {

            if (Array.isArray(newValues)) {
                return newValues;
            }

            return [newValues];

        };

        const convertedValues = convertToAutocompleteOptions(toArray());
        const convertedOptions = convertToOptions(convertedValues);

        props.onChange(convertedValues.map(current => current.value));

        setState({
            ...state,
            values: convertedValues,
            options: convertedOptions
        });

    };

    const filter = createFilterOptions<InternalAutocompleteOption<T>>();

    return (
        <div className={classes.root}>
            <Autocomplete
                multiple
                // freeSolo
                value={[...state.values]}
                // renderInput={props => renderInput(props)}
                options={[...state.options]}
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
                        autoFocus={props.autoFocus}
                        label={props.label}
                        placeholder={props.placeholder || ''}
                    />
                )}
            />

        </div>
    );
}
