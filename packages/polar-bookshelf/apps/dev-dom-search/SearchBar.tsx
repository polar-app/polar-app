import React from 'react';
import TextField from "@material-ui/core/TextField"

interface IProps {
    readonly onSearch: (text: string) => void;
}

export const SearchBar = (props: IProps) => {

    const value = React.useRef("");

    function handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>) {

        if (event.key === 'Enter') {
            // don't allow anything else to process this event.
            event.stopPropagation();
            event.preventDefault();

            props.onSearch(value.current);
        }

    }


    function handleChange(text: string) {
        value.current = text;
    }

    return (
        <TextField label="Enter a search: "
                   variant="outlined"
                   onChange={event => handleChange(event.currentTarget.value)}
                   onKeyPress={event => handleKeyPress(event)}/>
    )
}
