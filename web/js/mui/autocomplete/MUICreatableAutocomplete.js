"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const Autocomplete_1 = __importStar(require("@material-ui/lab/Autocomplete"));
const styles_1 = require("@material-ui/core/styles");
const TextField_1 = __importDefault(require("@material-ui/core/TextField"));
const Preconditions_1 = require("polar-shared/src/Preconditions");
const ArrayStreams_1 = require("polar-shared/src/util/ArrayStreams");
const Chip_1 = __importDefault(require("@material-ui/core/Chip"));
const MUIRelatedOptions_1 = require("./MUIRelatedOptions");
const PremiumFeature_1 = require("../../ui/premium_feature/PremiumFeature");
const Functions_1 = require("polar-shared/src/util/Functions");
const useStyles = styles_1.makeStyles((theme) => styles_1.createStyles({
    root: {
        width: 500,
    },
}));
function isCreateAutocompleteOption(option) {
    return Preconditions_1.isPresent(option.inputValue);
}
function isValueAutocompleteOption(option) {
    return Preconditions_1.isPresent(option.value);
}
function MUICreatableAutocomplete(props) {
    const classes = useStyles();
    const [state, setState] = react_1.useState({
        values: props.defaultOptions || [],
        options: props.options,
    });
    const [open, setOpen] = react_1.useState(false);
    const openRef = react_1.default.useRef(false);
    const [inputValue, setInputValue] = react_1.default.useState("");
    const highlighted = react_1.useRef(undefined);
    const optionsIndex = react_1.default.useMemo(() => {
        return ArrayStreams_1.arrayStream(props.options)
            .toMap(current => current.id);
    }, [props.options]);
    function setValues(values, options) {
        setState(Object.assign(Object.assign({}, state), { values, options: options || state.options }));
        props.onChange(values.map(current => current.value));
        highlighted.current = undefined;
    }
    const handleChange = (newValues) => {
        const convertToAutocompleteOptions = (rawOptions) => {
            const toAutocompleteOption = (option) => {
                if (isCreateAutocompleteOption(option)) {
                    return props.createOption(option.inputValue);
                }
                else {
                    return option;
                }
            };
            return rawOptions.map(toAutocompleteOption);
        };
        const convertToOptions = (newValues) => {
            const optionsMap = ArrayStreams_1.arrayStream(state.options)
                .toMap(current => current.id);
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
    const filter = Autocomplete_1.createFilterOptions();
    const computeRelatedOptions = () => {
        if (props.relatedOptionsCalculator) {
            const values = ArrayStreams_1.arrayStream(state.values)
                .filter(isValueAutocompleteOption)
                .map(current => current)
                .collect();
            return props.relatedOptionsCalculator(values);
        }
        else {
            return undefined;
        }
    };
    const relatedOptions = computeRelatedOptions();
    const handleKeyDown = (event) => {
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
    function fireOnOpen() {
        const onOpen = props.onOpen || Functions_1.NULL_FUNCTION;
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
    function hasExistingOption(newValue) {
        if (Preconditions_1.isPresent(optionsIndex[newValue])) {
            return true;
        }
        return ArrayStreams_1.arrayStream(state.values)
            .filter(current => current.id === newValue)
            .first() !== undefined;
    }
    function getOptionSelected(option, value) {
        return option.id === value.id;
    }
    return (react_1.default.createElement("div", { className: classes.root + ' ' + (props.className || ''), style: props.style },
        react_1.default.createElement(Autocomplete_1.default, { multiple: true, getOptionSelected: getOptionSelected, inputValue: inputValue, onKeyDown: handleKeyDown, value: [...state.values], options: [...state.options], open: open, onClose: handleClose, onOpen: handleOpen, getOptionLabel: (option) => option.label, clearOnBlur: false, onInputChange: (event, nextInputValue, reason) => {
                if (reason !== 'reset') {
                    setInputValue(nextInputValue);
                }
            }, onChange: (event, value, reason, details) => {
                handleChange(value);
                setInputValue('');
            }, filterSelectedOptions: true, filterOptions: (options, params) => {
                const filtered = filter(options, params);
                if (inputValue !== '' && !hasExistingOption(inputValue)) {
                    const createOption = Object.assign(Object.assign({}, props.createOption(inputValue)), { label: params.inputValue });
                    filtered.push(createOption);
                }
                return filtered;
            }, renderTags: (value, getTagProps) => value.map((option, index) => (react_1.default.createElement(Chip_1.default, Object.assign({ key: option.label, label: option.label, size: "small" }, getTagProps({ index }))))), onHighlightChange: (event, option, reason) => highlighted.current = option, renderInput: (params) => (react_1.default.createElement(TextField_1.default, Object.assign({}, params, { variant: "outlined", autoFocus: props.autoFocus, label: props.label, placeholder: props.placeholder || '' }))) }),
        relatedOptions !== undefined && (react_1.default.createElement(PremiumFeature_1.PremiumFeature, { required: 'plus', size: 'sm', feature: "related tags" },
            react_1.default.createElement(react_1.default.Fragment, null,
                react_1.default.createElement(MUIRelatedOptions_1.MUIRelatedOptions, { relatedOptions: relatedOptions, onAddRelatedOption: newOption => handleChange([...state.values, newOption]) }))))));
}
exports.default = MUICreatableAutocomplete;
//# sourceMappingURL=MUICreatableAutocomplete.js.map