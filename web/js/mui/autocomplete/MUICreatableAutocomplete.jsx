"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable no-use-before-define */
var react_1 = require("react");
var Autocomplete_1 = require("@material-ui/lab/Autocomplete");
var styles_1 = require("@material-ui/core/styles");
var TextField_1 = require("@material-ui/core/TextField");
var Preconditions_1 = require("polar-shared/src/Preconditions");
var ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
var Chip_1 = require("@material-ui/core/Chip");
var MUIRelatedOptions_1 = require("./MUIRelatedOptions");
var PremiumFeature_1 = require("../../ui/premium_feature/PremiumFeature");
var Functions_1 = require("polar-shared/src/util/Functions");
var useStyles = styles_1.makeStyles(function (theme) {
    return styles_1.createStyles({
        root: {
            width: 500,
        },
    });
});
function isCreateAutocompleteOption(option) {
    return Preconditions_1.isPresent(option.inputValue);
}
function isValueAutocompleteOption(option) {
    return Preconditions_1.isPresent(option.value);
}
function MUICreatableAutocomplete(props) {
    var classes = useStyles();
    var _a = react_1.useState({
        values: props.defaultOptions || [],
        options: props.options,
    }), state = _a[0], setState = _a[1];
    var _b = react_1.useState(false), open = _b[0], setOpen = _b[1];
    var openRef = react_1.default.useRef(false);
    var _c = react_1.default.useState(""), inputValue = _c[0], setInputValue = _c[1];
    var highlighted = react_1.useRef(undefined);
    // creates an index of the options by ID so that we can lookup quickly if
    // we have an existing entry to avoid double creating a 'create' option
    var optionsIndex = react_1.default.useMemo(function () {
        return ArrayStreams_1.arrayStream(props.options)
            .toMap(function (current) { return current.id; });
    }, [props.options]);
    /**
     * Centrally set the values so we can also reset other states, fire events,
     * etc.
     */
    function setValues(values, options) {
        setState(__assign(__assign({}, state), { values: values, options: options || state.options }));
        props.onChange(values.map(function (current) { return current.value; }));
        highlighted.current = undefined;
    }
    var handleChange = function (newValues) {
        var convertToAutocompleteOptions = function (rawOptions) {
            var toAutocompleteOption = function (option) {
                if (isCreateAutocompleteOption(option)) {
                    return props.createOption(option.inputValue);
                }
                else {
                    return option;
                }
            };
            return rawOptions.map(toAutocompleteOption);
        };
        // make sure any new values are in the options map because MUI gets mad
        // if there's a value that's not in the options.
        var convertToOptions = function (newValues) {
            var optionsMap = ArrayStreams_1.arrayStream(state.options)
                .toMap(function (current) { return current.id; });
            // force the new options into the map
            for (var _i = 0, newValues_1 = newValues; _i < newValues_1.length; _i++) {
                var newValue = newValues_1[_i];
                optionsMap[newValue.id] = newValue;
            }
            return Object.values(optionsMap);
        };
        if (newValues === null) {
            setValues([]);
            return;
        }
        var toArray = function () {
            if (Array.isArray(newValues)) {
                return newValues;
            }
            return [newValues];
        };
        var convertedValues = convertToAutocompleteOptions(toArray());
        var convertedOptions = convertToOptions(convertedValues);
        setValues(convertedValues, convertedOptions);
    };
    var filter = Autocomplete_1.createFilterOptions();
    var computeRelatedOptions = function () {
        if (props.relatedOptionsCalculator) {
            var values = ArrayStreams_1.arrayStream(state.values)
                .filter(isValueAutocompleteOption)
                .map(function (current) { return current; })
                .collect();
            return props.relatedOptionsCalculator(values);
        }
        else {
            // console.warn("No related options calculator");
            return undefined;
        }
    };
    var relatedOptions = computeRelatedOptions();
    var handleKeyDown = function (event) {
        if (event.key === 'Tab') {
            if (highlighted.current) {
                var values = __spreadArrays(state.values, [
                    highlighted.current
                ]);
                setValues(values);
                handleClose();
            }
            event.preventDefault();
            event.stopPropagation();
        }
    };
    function fireOnOpen() {
        var onOpen = props.onOpen || Functions_1.NULL_FUNCTION;
        onOpen(openRef.current);
        setOpen(openRef.current);
    }
    function handleClose() {
        highlighted.current = undefined;
        openRef.current = false;
        fireOnOpen();
    }
    function handleOpen() {
        openRef.current = true;
        fireOnOpen();
    }
    /**
     * Return true if the given selected values contains the potentially NEW
     * item so we can not show duplicates.
     */
    function hasExistingOption(newValue) {
        if (Preconditions_1.isPresent(optionsIndex[newValue])) {
            return true;
        }
        // return true if this was a previously selected value.
        return ArrayStreams_1.arrayStream(state.values)
            .filter(function (current) { return current.id === newValue; })
            .first() !== undefined;
    }
    // TODO: right now there's a bug where we're selecting filtering folder tags from the optiong
    // but providing them in the value so this returns an error.
    function getOptionSelected(option, value) {
        return option.id === value.id;
    }
    // TODO: one of our users suggested that 'tab' select the item since this
    // is somewhat standard but this requires that we use a controlled
    // auto-complete.  This breaks because there's a but which will cause the
    // inputValue to be reset when it re-renders again.
    return (<div className={classes.root + ' ' + (props.className || '')} style={props.style}>
            <Autocomplete_1.default multiple getOptionSelected={getOptionSelected} 
    // freeSolo
    inputValue={inputValue} onKeyDown={handleKeyDown} value={__spreadArrays(state.values)} 
    // renderInput={props => renderInput(props)}
    options={__spreadArrays(state.options)} open={open} onClose={handleClose} onOpen={handleOpen} 
    // NOTE that when we revert to manually managing this then the
    // input is reset each time we enter a first character of a
    // tag and then that character isn't shown - it swallows it.  A
    // solution might have something to do with freeSolo
    // onOpen={() => setOpen(true)}
    getOptionLabel={function (option) { return option.label; }} clearOnBlur={false} onInputChange={function (event, nextInputValue, reason) {
        if (reason !== 'reset') {
            // console.log(`nextInputValue: '${nextInputValue}' reason=${reason}`);
            setInputValue(nextInputValue);
        }
    }} onChange={function (event, value, reason, details) {
        handleChange(value);
        setInputValue('');
    }} filterSelectedOptions filterOptions={function (options, params) {
        var filtered = filter(options, params);
        if (inputValue !== '' && !hasExistingOption(inputValue)) {
            var createOption = __assign(__assign({}, props.createOption(inputValue)), { 
                // label: `Create: "${params.inputValue}"`
                // TODO: I think we should prefix this with 'Create'
                // but that means it has to be localized and whether
                // the option is created or not is kind of
                // irrelevant.
                label: params.inputValue });
            filtered.push(createOption);
        }
        return filtered;
    }} renderTags={function (value, getTagProps) {
        return value.map(function (option, index) { return (<Chip_1.default key={option.label} label={option.label} size="small" {...getTagProps({ index: index })}/>); });
    }} onHighlightChange={function (event, option, reason) { return highlighted.current = option; }} 
    // noOptionsText={<Button onClick={() => handleOptionCreated()}>Create "{value}"</Button>}
    renderInput={function (params) { return (<TextField_1.default {...params} variant="outlined" autoFocus={props.autoFocus} label={props.label} placeholder={props.placeholder || ''}/>); }}/>

            {relatedOptions !== undefined && (<PremiumFeature_1.PremiumFeature required='plus' size='sm' feature="related tags">
                    <>
                    <MUIRelatedOptions_1.MUIRelatedOptions relatedOptions={relatedOptions} onAddRelatedOption={function (newOption) { return handleChange(__spreadArrays(state.values, [newOption])); }}/>
                    </>
                </PremiumFeature_1.PremiumFeature>)}

        </div>);
}
exports.default = MUICreatableAutocomplete;
