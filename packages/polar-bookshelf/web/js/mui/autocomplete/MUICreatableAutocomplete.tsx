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
import {NULL_FUNCTION} from "polar-shared/src/util/Functions";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: 500,
            // marginTop: theme.spacing(1),
        },
    }),
);

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

interface CreateAutocompleteOption {
    readonly inputValue: string;
    readonly label: string;
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

    readonly className?: string;

    readonly style?: React.CSSProperties;

    readonly label?: string;

    readonly options: ReadonlyArray<ValueAutocompleteOption<T>>;

    readonly defaultOptions?: ReadonlyArray<ValueAutocompleteOption<T>>;

    readonly placeholder?: string

    readonly autoFocus?: boolean;

    /**
     * Used when converting an option entered by the user to an object with
     * a label so that new items can be created.
     */
    readonly createOption: (label: string) => ValueAutocompleteOption<T>;

    readonly onChange: (selected: ReadonlyArray<T>) => void;

    readonly relatedOptionsCalculator?: RelatedOptionsCalculator<T>;

    /**
     * Called when the autocomplete options are open with true and then false
     * when we close it.
     */
    readonly onOpen?: (open: boolean) => void;

}

interface IState<T> {
    readonly values: ReadonlyArray<ValueAutocompleteOption<T>>;
    readonly options: ReadonlyArray<ValueAutocompleteOption<T>>;
}

function sortOptions<T>(options: ReadonlyArray<ValueAutocompleteOption<T>>) {

    const hierarchical = options.filter(current => current.label.startsWith('/'));
    const flat = options.filter(current => ! current.label.startsWith('/'));

    function doSort(a: ValueAutocompleteOption<T>, b: ValueAutocompleteOption<T>) {
        return a.label.localeCompare(b.label);
    }

    return [
        ...flat.sort(doSort),
        ...hierarchical.sort(doSort)
    ]

}

export default function MUICreatableAutocomplete<T>(props: MUICreatableAutocompleteProps<T>) {

    const classes = useStyles();

    const options = React.useMemo(() => sortOptions(props.options), [props.options]);

    const [state, setState] = useState<IState<T>>({
        values: props.defaultOptions || [],
        options
    });

    const [open, setOpen] = useState<boolean>(false);

    const openRef = React.useRef(false);
    const [inputValue, setInputValue] = React.useState("");

    const highlighted = useRef<ValueAutocompleteOption<T> | null>(null);

    // creates an index of the options by ID so that we can lookup quickly if
    // we have an existing entry to avoid double creating a 'create' option
    const optionsIndex = React.useMemo(() => {
        return arrayStream(options)
                   .toMap(current => current.id);
    }, [options])

    /**
     * Centrally set the values so we can also reset other states, fire events,
     * etc.
     */
    const setValues = React.useCallback((values: ReadonlyArray<ValueAutocompleteOption<T>>,
                                         options?: ReadonlyArray<ValueAutocompleteOption<T>>) => {

        setState({
            ...state,
            values,
            options: options || state.options
        });

        props.onChange(values.map(current => current.value));

        highlighted.current = null;

    }, [props, state]);

    const handleChange = React.useCallback((newValues: InternalAutocompleteOption<T> | null | InternalAutocompleteOption<T>[]) => {

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

    }, [props, setValues, state.options]);

    const filter = createFilterOptions<ValueAutocompleteOption<T>>();

    const computeRelatedOptions = (): ReadonlyArray<ValueAutocompleteOption<T>> | undefined => {

        if (props.relatedOptionsCalculator) {

            const values =
                arrayStream(state.values)
                    .filter(isValueAutocompleteOption)
                    .map(current => current as ValueAutocompleteOption<T>)
                    .collect();

            return props.relatedOptionsCalculator(values);

        } else {
            // console.warn("No related options calculator");
            return undefined;
        }

    };

    const relatedOptions = computeRelatedOptions();

    const fireOnOpen = React.useCallback(() => {
        const onOpen = props.onOpen || NULL_FUNCTION;
        onOpen(openRef.current);
        setOpen(openRef.current);
    }, [props.onOpen]);

    const handleClose = React.useCallback(() => {

        highlighted.current = null;
        openRef.current = false;
        fireOnOpen();

    }, [fireOnOpen]);

    const createNewOptionOnEnter = React.useCallback(() => {

        function findOption() {
            return arrayStream(options)
                .filter(current => current.label.toLowerCase() === inputValue)
                .first();
        }

        function createOption(): CreateAutocompleteOption {
            return {
                inputValue,
                label: inputValue
            };
        }

        const newOption = findOption() || createOption();

        setInputValue('');
        setOpen(false);
        return handleChange([...state.values, newOption]);

    }, [handleChange, inputValue, options, state.values])

    const handleKeyUp = React.useCallback((event: React.KeyboardEvent) => {

        function abortEvent() {

            event.preventDefault();
            event.stopPropagation();

        }

        if (event.key === 'Tab') {

            if (highlighted.current) {

                const values = [
                    ...state.values,
                    highlighted.current
                ];

                setValues(values);
                handleClose();

            }

            abortEvent();

        }

        if (inputValue !== '') {

            if (event.key === 'Enter') {
                createNewOptionOnEnter();
            }

        }

    }, [createNewOptionOnEnter, handleClose, inputValue, setValues, state.values]);

    function handleOpen() {
        openRef.current = true;
        fireOnOpen();
    }

    /**
     * Return true if the given selected values contains the potentially NEW
     * item so we can not show duplicates.
     */
    function hasExistingOption(newValue: string) {

        if (isPresent(optionsIndex[newValue])) {
            return true;
        }

        // return true if this was a previously selected value.
        return arrayStream(state.values)
                    .filter(current => current.id === newValue)
                    .first() !== undefined;

    }

    // TODO: right now there's a bug where we're selecting filtering folder tags from the optiong
    // but providing them in the value so this returns an error.
    function getOptionSelected<T>(option: ValueAutocompleteOption<T>, value: ValueAutocompleteOption<T>) {
        return option.id === value.id;
    }

    const handleHighlightChange = React.useCallback((event: React.ChangeEvent<{}>, option: ValueAutocompleteOption<T> | null) => {

        highlighted.current = option;

    }, []);

    // TODO: one of our users suggested that 'tab' select the item since this
    // is somewhat standard but this requires that we use a controlled
    // auto-complete.  This breaks because there's a but which will cause the
    // inputValue to be reset when it re-renders again.

    return (
        <div className={classes.root + ' ' + (props.className || '')}
             style={props.style}>
            <Autocomplete
                multiple
                getOptionSelected={getOptionSelected}
                // freeSolo
                inputValue={inputValue}
                onKeyUp={handleKeyUp}
                value={[...state.values]}
                // renderInput={props => renderInput(props)}
                options={[...state.options]}
                open={open}
                onClose={handleClose}
                onOpen={handleOpen}
                // NOTE that when we revert to manually managing this then the
                // input is reset each time we enter a first character of a
                // tag and then that character isn't shown - it swallows it.  A
                // solution might have something to do with freeSolo
                // onOpen={() => setOpen(true)}
                getOptionLabel={(option) => option.label}
                clearOnBlur={false}
                onInputChange={(event, nextInputValue, reason) => {

                    if (reason !== 'reset') {
                        // console.log(`nextInputValue: '${nextInputValue}' reason=${reason}`);
                        setInputValue(nextInputValue);
                    }

                }}
                onChange={(event, value, reason, details) => {
                    handleChange(value);
                    setInputValue('');
                }}
                filterSelectedOptions
                filterOptions={(options, params) => {

                    const filtered = filter(options, params);

                    if (inputValue !== '' && ! hasExistingOption(inputValue)) {

                        const createOption = {
                            ...props.createOption(inputValue),
                            // label: `Create: "${params.inputValue}"`
                            // TODO: I think we should prefix this with 'Create'
                            // but that means it has to be localized and whether
                            // the option is created or not is kind of
                            // irrelevant.
                            label: params.inputValue
                        }

                        filtered.push(createOption);

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
                onHighlightChange={handleHighlightChange}
                // noOptionsText={<Button onClick={() => handleOptionCreated()}>Create "{value}"</Button>}
                // ListboxComponent="ul"
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

            <PremiumFeature required='plus' size='sm' feature="related tags">
                <>
                <MUIRelatedOptions relatedOptions={relatedOptions || []}
                                   onAddRelatedOption={newOption => handleChange([...state.values, newOption])}/>
                </>
            </PremiumFeature>

        </div>
    );
}
