/* eslint-disable no-use-before-define */
import React, {useRef, useState} from 'react';
import Autocomplete, {createFilterOptions} from '@material-ui/lab/Autocomplete';
import {createStyles, makeStyles, Theme} from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import {isPresent} from "polar-shared/src/Preconditions";
import {arrayStream} from 'polar-shared/src/util/ArrayStreams';
import Chip from '@material-ui/core/Chip';
import {MUIRelatedOptions} from "./MUIRelatedOptions";
import {PremiumFeature} from "../../ui/premium_feature/PremiumFeature";
import isEqual from "react-fast-compare";
import {AutocompleteProps} from "@material-ui/lab/Autocomplete/Autocomplete";
import {UseAutocompleteProps} from "@material-ui/lab/useAutocomplete";

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

/**
 * An option with a value.
 */
export interface ValueAutocompleteOption<T> {

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

type InternalAutocompleteOption<T> = CreateAutocompleteOption | ValueAutocompleteOption<T>;

function isCreateAutocompleteOption<T>(option: InternalAutocompleteOption<T>): option is CreateAutocompleteOption {
    return isPresent((option as any).inputValue);
}

function isValueAutocompleteOption<T>(option: InternalAutocompleteOption<T>): option is ValueAutocompleteOption<T> {
    return isPresent((option as any).value);
}

export type RelatedOptionsCalculator<T> = (options: ReadonlyArray<ValueAutocompleteOption<T>>) => ReadonlyArray<ValueAutocompleteOption<T>>;

export interface MUICreatableAutocompleteProps<T> {

    readonly label?: string;

    readonly options: ReadonlyArray<ValueAutocompleteOption<T>>;

    readonly defaultOptions?: ReadonlyArray<ValueAutocompleteOption<T>>;

    readonly placeholder?: string

    readonly autoFocus?: boolean;

    /**
     * Used when converting an option entered by the user to an object with
     * a label.
     */
    readonly createOption: (label: string) => ValueAutocompleteOption<T>;

    readonly onChange: (selected: ReadonlyArray<T>) => void;

    readonly relatedOptionsCalculator?: RelatedOptionsCalculator<T>;

}

interface IState<T> {
    readonly values: ReadonlyArray<ValueAutocompleteOption<T>>;
    readonly options: ReadonlyArray<ValueAutocompleteOption<T>>;
}

type HighlightChangeReason = 'keyboard' | 'auto' | 'mouse';

interface IHighlightChangeAutocompleteProps<T> {
    readonly onHighlightChange: (event: object,
                                 option: T,
                                 reason: HighlightChangeReason) => void;
}

type IFixedAutocomplete<T> = (props: AutocompleteProps<T> & UseAutocompleteProps<T> & IHighlightChangeAutocompleteProps<T>) => JSX.Element;

export default function MUICreatableAutocomplete<T>(props: MUICreatableAutocompleteProps<T>) {

    // TODO this is an ugly hack from 04/2020 that can be removed in the future
    // when Autocomplete adds back onHighlightChange
    const FixedAutocomplete: IFixedAutocomplete<any> = Autocomplete

    const classes = useStyles();

    const [state, setState] = useState<IState<T>>({
        values: props.defaultOptions || [],
        options: props.options,
    });

    const [open, setOpen] = useState<boolean>(false);

    const highlighted = useRef<ValueAutocompleteOption<T> | undefined>(undefined);

    /**
     * Centrally set the values so we can also reset other states, fire events,
     * etc.
     */
    function setValues(values: ReadonlyArray<ValueAutocompleteOption<T>>,
                       options?: ReadonlyArray<ValueAutocompleteOption<T>>) {

        setState({
            ...state,
            values,
            options: options || state.options
        });

        props.onChange(values.map(current => current.value));

        highlighted.current = undefined;

    }

    const handleChange = (newValues: InternalAutocompleteOption<T> | null | InternalAutocompleteOption<T>[]) => {

        const convertToAutocompleteOptions = (rawOptions: ReadonlyArray<InternalAutocompleteOption<T>>): ReadonlyArray<ValueAutocompleteOption<T>> => {

            const toAutocompleteOption = (option: InternalAutocompleteOption<T>): ValueAutocompleteOption<T> => {
                if (isCreateAutocompleteOption(option)) {
                    return props.createOption(option.inputValue);
                } else {
                    return option;
                }
            };

            return rawOptions.map(toAutocompleteOption);

        };

        // make sure any new values are in the options map because MUI gets mad
        // if there's a value that's not in the options.
        const convertToOptions = (newValues: ReadonlyArray<ValueAutocompleteOption<T>>) => {

            const optionsMap = arrayStream(state.options)
                .toMap(current => current.id);

            // force the new options into the map

            for (const newValue of newValues) {
                optionsMap[newValue.id] = newValue;
            }

            return Object.values(optionsMap);

        };

        if (newValues === null) {

            setValues([]);
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

        setValues(convertedValues, convertedOptions);

    };

    const filter = createFilterOptions<InternalAutocompleteOption<T>>();

    const computeRelatedOptions = (): ReadonlyArray<ValueAutocompleteOption<T>> => {
        
        if (props.relatedOptionsCalculator) {

            const values =
                arrayStream(state.values)
                    .filter(isValueAutocompleteOption)
                    .map(current => current as ValueAutocompleteOption<T>)
                    .collect();

            return props.relatedOptionsCalculator(values);

        }
        
        return [];
        
    };
    
    const relatedOptions = computeRelatedOptions();

    const handleKeyDown = (event: React.KeyboardEvent) => {

        if (event.key === 'Tab') {

            if (highlighted.current) {

                const values = [
                    ...state.values,
                    highlighted.current
                ];

                setValues(values);
                handleClose();

            }

            event.preventDefault();
            event.stopPropagation();
        }

    };

    function handleClose() {
        highlighted.current = undefined;
        setOpen(false);
    }

    return (
        <div className={classes.root}>
            <FixedAutocomplete
                multiple
                getOptionSelected={isEqual}
                // freeSolo
                onKeyDown={handleKeyDown}
                value={[...state.values]}
                // renderInput={props => renderInput(props)}
                options={[...state.options]}
                open={open}
                onClose={handleClose}
                onOpen={() => setOpen(true)}
                getOptionLabel={(option) => option.label}
                onChange={(event, value, reason, details) => handleChange(value)}
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
                renderTags={(value, getTagProps) =>
                    value.map((option, index) => (
                        <Chip key={option.label}
                              label={option.label}
                              size="small"
                              {...getTagProps({ index })} />
                    ))
                }
                onHighlightChange={(event: object, option: any, reason: any) => highlighted.current = option}
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

            <PremiumFeature required='bronze' size='sm' feature="related tags">
                <MUIRelatedOptions relatedOptions={relatedOptions}
                                   onAddRelatedOption={newOption => handleChange([...state.values, newOption])}/>
            </PremiumFeature>
            
        </div>
    );
}
