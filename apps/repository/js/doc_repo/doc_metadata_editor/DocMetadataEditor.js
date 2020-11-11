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
exports.DocMetadataEditor = void 0;
const React = __importStar(require("react"));
const ReactUtils_1 = require("../../../../../web/js/react/ReactUtils");
const StringProperty_1 = require("./StringProperty");
const Box_1 = __importDefault(require("@material-ui/core/Box"));
const makeStyles_1 = __importDefault(require("@material-ui/core/styles/makeStyles"));
const createStyles_1 = __importDefault(require("@material-ui/core/styles/createStyles"));
const StringArrayAutocompleteProperty_1 = require("./StringArrayAutocompleteProperty");
const Dictionaries_1 = require("polar-shared/src/util/Dictionaries");
const TextProperty_1 = require("./TextProperty");
const MonthProperty_1 = require("./MonthProperty");
const FIELDS = [
    {
        name: 'title',
        description: "The title of the document/work",
        optional: true,
        type: 'string'
    },
    {
        name: 'description',
        description: "A short description for the document.",
        optional: true,
        type: 'string'
    },
    {
        name: 'abstract',
        description: "A long text overview of the document.",
        optional: true,
        type: 'text'
    },
    {
        name: 'keywords',
        description: 'The keywords that are defined by the publisher for this document',
        optional: true,
        type: 'string[]'
    },
    {
        name: 'authors',
        description: 'The author or authors of this document',
        optional: true,
        type: 'string[]'
    },
    {
        name: 'editor',
        description: 'The editor or editors of this document',
        optional: true,
        type: 'string[]'
    },
    {
        name: 'month',
        description: 'The month this document was published',
        optional: true,
        type: 'month'
    },
    {
        name: 'year',
        description: 'The year this document was published',
        optional: true,
        type: 'string'
    },
    {
        name: 'volume',
        description: "The volume of a journal or multi-volume book.",
        optional: true,
        type: 'string'
    },
    {
        name: 'edition',
        description: "The edition of a book--for example, 'Second'.",
        optional: true,
        type: 'string'
    },
    {
        name: 'issn',
        description: "International Standard Serial Number (ISSN) of a journal or magazine",
        label: 'ISSN',
        optional: true,
        type: 'string'
    },
    {
        name: 'isbn',
        label: 'ISBN',
        description: 'An International Standard Book Number is a numeric commercial book identifier.',
        optional: true,
        type: 'string'
    },
    {
        name: 'doi',
        label: 'DOI',
        description: 'Document Identifier (DOI)',
        optional: true,
        type: 'string'
    },
    {
        name: 'pmid',
        label: 'PMID',
        description: 'PubMed ID',
        optional: true,
        type: 'string'
    },
    {
        name: 'journal',
        description: "The name of the journal in which this work was published.",
        optional: true,
        type: 'string'
    },
    {
        name: 'publisher',
        description: 'The publisher of this document.  Usually the name of an academic journal',
        optional: true,
        type: 'string'
    },
    {
        name: 'copyright',
        description: 'The copyright of this document.',
        optional: true,
        type: 'string'
    }
];
const useStyles = makeStyles_1.default(() => createStyles_1.default({
    box: {
        display: 'flex'
    },
    property: {
        flexGrow: 1
    },
}));
exports.DocMetadataEditor = ReactUtils_1.deepMemo((props) => {
    const [docInfo, setDocInfo] = React.useState(props.docInfo);
    const classes = useStyles();
    const handleDocInfo = React.useCallback((newDocInfo) => {
        props.onUpdate(newDocInfo);
        setDocInfo(newDocInfo);
    }, [props]);
    const handleFieldChangeForString = React.useCallback((field, value) => {
        const newDocInfo = Dictionaries_1.Dictionaries.deepCopy(props.docInfo);
        if (field.optional) {
            newDocInfo[field.name] = value.trim() === '' ? undefined : value.trim();
        }
        else {
            newDocInfo[field.name] = value;
        }
        handleDocInfo(newDocInfo);
    }, [handleDocInfo, props.docInfo]);
    const handleFieldChangeForStringArray = React.useCallback((field, values) => {
        const newDocInfo = Dictionaries_1.Dictionaries.deepCopy(props.docInfo);
        if (field.optional) {
            newDocInfo[field.name] = values.length === 0 ? undefined : values;
        }
        else {
            newDocInfo[field.name] = values;
        }
        handleDocInfo(newDocInfo);
    }, [handleDocInfo, props.docInfo]);
    const toComponent = React.useCallback((property) => {
        switch (property.type) {
            case "string":
                return (React.createElement(StringProperty_1.StringProperty, Object.assign({ className: classes.property, docInfo: docInfo, value: docInfo[property.name], onChange: value => handleFieldChangeForString(property, value) }, property)));
            case "string[]":
                return (React.createElement(StringArrayAutocompleteProperty_1.StringArrayAutocompleteProperty, Object.assign({ className: classes.property, docInfo: docInfo, values: Object.values(docInfo[property.name] || {}), onChange: values => handleFieldChangeForStringArray(property, values) }, property)));
            case "text":
                return (React.createElement(TextProperty_1.TextProperty, Object.assign({ className: classes.property, docInfo: docInfo, value: docInfo[property.name], onChange: value => handleFieldChangeForString(property, value) }, property)));
            case "month":
                return (React.createElement(MonthProperty_1.MonthProperty, Object.assign({ className: classes.property, docInfo: docInfo, value: docInfo[property.name], onChange: value => handleFieldChangeForString(property, value) }, property)));
            default:
                return null;
        }
    }, [classes.property, docInfo, handleFieldChangeForString, handleFieldChangeForStringArray]);
    return (React.createElement("div", null, FIELDS.map(current => (React.createElement(Box_1.default, { key: current.name, className: classes.box, mt: 1 }, toComponent(current))))));
});
//# sourceMappingURL=DocMetadataEditor.js.map