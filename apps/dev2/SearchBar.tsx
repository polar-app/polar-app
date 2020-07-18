import React from 'react';
import TextField from "@material-ui/core/TextField"

export const SearchBar = () => {

    const value = React.useRef("");

    function doSearch(text: string) {
        // use the new search frame work to see if we can find the text on
        // the page...
    }

    function handleKeyPress(event: React.KeyboardEvent<HTMLDivElement>) {

        if ((event.ctrlKey || event.metaKey) && event.key === 'Enter') {
            // don't allow anything else to process this event.
            event.stopPropagation();
            event.preventDefault();

            doSearch(value.current);
        }

    }


    function handleChange(text: string) {
        value.current = text;
    }

    return (
        <TextField label="Outlined"
                   variant="outlined"
                   onChange={event => handleChange(event.currentTarget.value)}
                   onKeyPress={event => handleKeyPress(event)}/>
    )
}
