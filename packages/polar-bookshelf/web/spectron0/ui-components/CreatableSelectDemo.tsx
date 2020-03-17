import CreatableSelect from 'react-select/Creatable';
import * as React from "react";

const options = [
    {
        value: 'foo',
        label: 'foo'
    }
];

export const CreatableSelectDemo = () => (
    <CreatableSelect
        isMulti
        isClearable
        autoFocus
        // onKeyDown={event => props.onKeyDown(event)}
        className="basic-multi-select"
        classNamePrefix="select"
        // onChange={(selectedOptions) => props.handleChange(selectedOptions as TagOption[])}
        // value={props.pendingTagOptions}
        // defaultValue={props.pendingTagOptions}
        placeholder="Create or select ..."
        options={options}
        onKeyDown={() => console.log("FIXME onKeyDown1")}
        onKeyPress={() => console.log("FIXME onKeyPress1")}
    />

);

