import * as React from "react";
import Select from "react-select";
import {nullToUndefined} from "polar-shared/src/util/Nullable";
import {toIdentifier} from "polar-shared/src/util/Identifiers";

export interface IOption<T> {
    readonly value: T;
    readonly label: string;
}

const fieldsOfStudy = [
    "Agricultural and Biological Sciences",
    "Arts and Humanities",
    "Biochemistry, Genetics and Molecular Biology",
    "Business, Management and Accounting",
    "Chemical Engineering",
    "Chemistry",
    "Computer Science",
    "Decision Sciences",
    "Design",
    "Earth and Planetary Sciences",
    "Economics, Econometrics and Finance",
    "Energy",
    "Engineering",
    "Environmental Science",
    "Immunology and Microbiology",
    "Linguistics",
    "Materials Science",
    "Mathematics",
    "Medicine and Dentistry",
    "Neuroscience",
    "Nursing and Health Professions",
    "Pharmacology, Toxicology and Pharmaceutical Science",
    "Philosophy",
    "Physics and Astronomy",
    "Psychology",
    "Social Sciences",
    "Sports and Recreations",
    "Veterinary Science and Veterinary Medicine",
];

export interface FieldOfStudy {
    readonly id: string;
    readonly name: string;
}


function toFieldOfStudy(name: string): FieldOfStudy {
    const id = toIdentifier(name);
    return {id, name};
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
    /**
     *
     */
    readonly onSelect: (option: IOption<FieldOfStudy> | undefined) => void;
}


export const FieldOfStudySelect = (props: IProps) => {

    type RawOption = IOption<FieldOfStudy> | null;

    return (
        <Select
            isClearable
            autoFocus
            placeholder="Search for a field of study..."
            options={options}
            onChange={(option => props.onSelect(nullToUndefined(option as RawOption)))}
            // onKeyDown={event => props.onKeyDown(event)}
            // onChange={(selectedOptions) => props.handleChange(selectedOptions as TagOption[])}
            // value={props.pendingTagOptions}
            // defaultValue={props.pendingTagOptions}
        />
    );
};

